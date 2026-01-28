"""
Event Search Service - Core search logic with concurrent file processing
"""

import os
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Optional, List, Dict, Any
from django.conf import settings


EVENT_FIELDS = [
    'serialno', 'version', 'account_id', 'instance_id', 'srcaddr',
    'dstaddr', 'srcport', 'dstport', 'protocol', 'packets',
    'bytes', 'starttime', 'endtime', 'action', 'log_status'
]

SEARCHABLE_FIELDS = ['account_id', 'instance_id', 'srcaddr', 'dstaddr', 'action', 'log_status']


def parse_event_line(line: str, filename: str) -> Optional[Dict[str, Any]]:
    parts = line.strip().split()
    if len(parts) < 15:
        return None
    
    try:
        return {
            'serialno': int(parts[0]),
            'version': int(parts[1]),
            'account_id': parts[2],
            'instance_id': parts[3],
            'srcaddr': parts[4],
            'dstaddr': parts[5],
            'srcport': int(parts[6]),
            'dstport': int(parts[7]),
            'protocol': int(parts[8]),
            'packets': int(parts[9]),
            'bytes': int(parts[10]),
            'starttime': int(parts[11]),
            'endtime': int(parts[12]),
            'action': parts[13],
            'log_status': parts[14],
            'source_file': filename
        }
    except (ValueError, IndexError):
        return None


def matches_criteria(event: Dict[str, Any], search_string: Optional[str], 
                    earliest_time: Optional[int], latest_time: Optional[int]) -> bool:
    if earliest_time is not None:
        if event['starttime'] < earliest_time and event['endtime'] < earliest_time:
            return False
    
    if latest_time is not None:
        if event['starttime'] > latest_time and event['endtime'] > latest_time:
            return False
    
    if search_string:
        search_lower = search_string.lower()
        found = False
        for field in SEARCHABLE_FIELDS:
            if search_lower in str(event.get(field, '')).lower():
                found = True
                break
        if not found:
            return False
    
    return True


def search_single_file(filepath: str, search_string: Optional[str],
                       earliest_time: Optional[int], latest_time: Optional[int]) -> List[Dict[str, Any]]:
    results = []
    filename = os.path.basename(filepath)
    
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            for line in f:
                event = parse_event_line(line, filename)
                if event and matches_criteria(event, search_string, earliest_time, latest_time):
                    results.append(event)
    except Exception as e:
        print(f"Error reading file {filepath}: {e}")
    
    return results


def get_all_event_files() -> List[str]:
    files = []
    
    uploads_dir = settings.UPLOADS_DIR
    if os.path.isdir(uploads_dir):
        for filename in os.listdir(uploads_dir):
            filepath = os.path.join(uploads_dir, filename)
            if os.path.isfile(filepath):
                files.append(filepath)
    
    return files


def search_events(search_string: Optional[str] = None,
                  earliest_time: Optional[int] = None,
                  latest_time: Optional[int] = None) -> Dict[str, Any]:
    start_time = time.time()
    
    files = get_all_event_files()
    all_results = []
    
    max_workers = min(32, len(files) or 1)  
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_file = {
            executor.submit(search_single_file, filepath, search_string, earliest_time, latest_time): filepath
            for filepath in files
        }
        
        for future in as_completed(future_to_file):
            try:
                file_results = future.result()
                all_results.extend(file_results)
            except Exception as e:
                print(f"Error processing file: {e}")
    
    all_results.sort(key=lambda x: x['starttime'], reverse=True)
    
    end_time = time.time()
    search_duration = round(end_time - start_time, 3)
    
    return {
        'success': True,
        'search_time_seconds': search_duration,
        'total_results': len(all_results),
        'results_returned': len(all_results),
        'files_searched': len(files),
        'results': all_results
    }
