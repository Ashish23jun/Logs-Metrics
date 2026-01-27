"""
API Views for Event Search
"""

import os
import tarfile
import tempfile
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from django.conf import settings

from .serializers import SearchRequestSerializer, SearchResponseSerializer, UploadResponseSerializer
from .services import search_events, get_all_event_files


@api_view(['POST', 'GET'])
def search_events_view(request):
    """
    Search through event files.
    
    POST /api/events/search/
    
    Request body:
    {
        "search_string": "159.62.125.136",  # Optional - search in any field
        "earliest_time": 1725850449,        # Optional - epoch timestamp
        "latest_time": 1725855086,          # Optional - epoch timestamp
        "max_results": 1000                 # Optional - default 1000
    }
    """
    if request.method == 'GET':
        data = request.query_params
    else:
        data = request.data
    
    serializer = SearchRequestSerializer(data=data)
    
    if not serializer.is_valid():
        return Response({
            'success': False,
            'error': 'Invalid request parameters',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    validated_data = serializer.validated_data
    
    results = search_events(
        search_string=validated_data.get('search_string') or None,
        earliest_time=validated_data.get('earliest_time'),
        latest_time=validated_data.get('latest_time'),
        max_results=validated_data.get('max_results', 1000)
    )
    
    return Response(results)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_files_view(request):
    """
    Upload event files.
    
    POST /api/events/upload/
    Content-Type: multipart/form-data
    
    Supports:
    - Regular event files (saved directly)
    - .tgz/.tar.gz archives (extracted and contents saved)
    """
    files = request.FILES.getlist('files')
    
    if not files:
        return Response({
            'success': False,
            'error': 'No files provided'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    uploaded_files = []
    
    for uploaded_file in files:
        filename = uploaded_file.name
        
        if filename.endswith('.tgz') or filename.endswith('.tar.gz'):
            try:
                with tempfile.NamedTemporaryFile(delete=False, suffix='.tgz') as tmp:
                    for chunk in uploaded_file.chunks():
                        tmp.write(chunk)
                    tmp_path = tmp.name
                
                with tarfile.open(tmp_path, 'r:gz') as tar:
                    for member in tar.getmembers():
                        if member.isfile():
                            f = tar.extractfile(member)
                            if f:
                                dest_filename = os.path.basename(member.name)
                                dest_path = os.path.join(settings.UPLOADS_DIR, dest_filename)
                                with open(dest_path, 'wb') as dest:
                                    dest.write(f.read())
                                uploaded_files.append(dest_filename)
                
                os.unlink(tmp_path)
                
            except Exception as e:
                return Response({
                    'success': False,
                    'error': f'Failed to extract archive {filename}: {str(e)}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            filepath = os.path.join(settings.UPLOADS_DIR, filename)
            try:
                with open(filepath, 'wb+') as destination:
                    for chunk in uploaded_file.chunks():
                        destination.write(chunk)
                uploaded_files.append(filename)
            except Exception as e:
                return Response({
                    'success': False,
                    'error': f'Failed to save file {filename}: {str(e)}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    total_files = len(get_all_event_files())
    
    response_data = {
        'success': True,
        'files_uploaded': uploaded_files,
        'total_files': total_files,
        'message': f'Successfully uploaded {len(uploaded_files)} file(s)'
    }
    
    return Response(response_data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def health_check(request):
    """Health check endpoint."""
    files = get_all_event_files()
    return Response({
        'status': 'healthy',
        'total_event_files': len(files),
        'events_dir': settings.EVENTS_DIR,
        'uploads_dir': settings.UPLOADS_DIR
    })
