"""
URL configuration for Event Search API
"""

from django.urls import path, include

urlpatterns = [
    path('api/', include('events.urls')),
]
