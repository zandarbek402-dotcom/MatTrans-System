from django.urls import path
from .views import (
    TransportRouteListCreateView,
    TransportRouteDetailView,
    TransportHistoryListCreateView,
    TransportHistoryDetailView,
    route_statistics,
    route_by_material,
)

urlpatterns = [
    path('routes/', TransportRouteListCreateView.as_view(), name='route-list-create'),
    path('routes/<int:pk>/', TransportRouteDetailView.as_view(), name='route-detail'),
    path('routes/material/<int:material_id>/', route_by_material, name='route-by-material'),
    path('routes/statistics/', route_statistics, name='route-statistics'),
    path('history/', TransportHistoryListCreateView.as_view(), name='history-list-create'),
    path('history/<int:pk>/', TransportHistoryDetailView.as_view(), name='history-detail'),
]


