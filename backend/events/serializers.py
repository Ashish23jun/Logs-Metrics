
from rest_framework import serializers


class SearchRequestSerializer(serializers.Serializer):
    search_string = serializers.CharField(required=False, allow_blank=True, default='')
    search_field = serializers.CharField(required=False, allow_blank=True, default='')
    earliest_time = serializers.IntegerField(required=False, allow_null=True, default=None)
    latest_time = serializers.IntegerField(required=False, allow_null=True, default=None)
    
    def validate_search_field(self, value):
        """Validate that search_field is a valid field name."""
        if value and value not in ['', 'serialno', 'version', 'account_id', 'instance_id', 
                                     'srcaddr', 'dstaddr', 'srcport', 'dstport', 'protocol', 
                                     'packets', 'bytes', 'starttime', 'endtime', 'action', 'log_status']:
            raise serializers.ValidationError(f"Invalid search field: {value}")
        return value


class EventSerializer(serializers.Serializer):
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
    success = serializers.BooleanField()
    search_time_seconds = serializers.FloatField()
    total_results = serializers.IntegerField()
    results_returned = serializers.IntegerField()
    files_searched = serializers.IntegerField()
    results = EventSerializer(many=True)


class UploadResponseSerializer(serializers.Serializer):
    success = serializers.BooleanField()
    files_uploaded = serializers.ListField(child=serializers.CharField())
    total_files = serializers.IntegerField()
    message = serializers.CharField()
