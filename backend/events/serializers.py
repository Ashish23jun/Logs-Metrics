"""
Serializers for Event Search API
"""

from rest_framework import serializers


class SearchRequestSerializer(serializers.Serializer):
    """Serializer for search request parameters."""
    search_string = serializers.CharField(required=False, allow_blank=True, default='')
    earliest_time = serializers.IntegerField(required=False, allow_null=True, default=None)
    latest_time = serializers.IntegerField(required=False, allow_null=True, default=None)


class EventSerializer(serializers.Serializer):
    """Serializer for event data."""
    serialno = serializers.IntegerField()
    version = serializers.IntegerField()
    account_id = serializers.CharField()
    instance_id = serializers.CharField()
    srcaddr = serializers.CharField()
    dstaddr = serializers.CharField()
    srcport = serializers.IntegerField()
    dstport = serializers.IntegerField()
    protocol = serializers.IntegerField()
    packets = serializers.IntegerField()
    bytes = serializers.IntegerField()
    starttime = serializers.IntegerField()
    endtime = serializers.IntegerField()
    action = serializers.CharField()
    log_status = serializers.CharField()
    source_file = serializers.CharField()


class SearchResponseSerializer(serializers.Serializer):
    """Serializer for search response."""
    success = serializers.BooleanField()
    search_time_seconds = serializers.FloatField()
    total_results = serializers.IntegerField()
    results_returned = serializers.IntegerField()
    files_searched = serializers.IntegerField()
    results = EventSerializer(many=True)


class UploadResponseSerializer(serializers.Serializer):
    """Serializer for file upload response."""
    success = serializers.BooleanField()
    files_uploaded = serializers.ListField(child=serializers.CharField())
    total_files = serializers.IntegerField()
    message = serializers.CharField()
