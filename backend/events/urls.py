"""
URL configuration for Events API
"""

from django.urls import path
from . import views

urlpatterns = [
    path('events/search/', views.search_events_view, name='search_events'),
    path('events/upload/', views.upload_files_view, name='upload_files'),
    path('health/', views.health_check, name='health_check'),
]
