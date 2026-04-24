from rest_framework import generics, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count
from .models import TransportRoute, TransportHistory
from .serializers import (
    TransportRouteSerializer,
    TransportRouteCreateSerializer,
    TransportHistorySerializer,
    TransportHistoryCreateSerializer,
)
from accounts.permissions import IsAdminOrReadOnly


class TransportRouteListCreateView(generics.ListCreateAPIView):
    """List and create transport routes"""
    queryset = TransportRoute.objects.select_related(
        'material', 'created_by'
    ).prefetch_related('history').all()
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'material']
    search_fields = [
        'origin_location', 'destination_location',
        'transport_company', 'driver_name', 'vehicle_number'
    ]
    ordering_fields = ['planned_date', 'actual_date', 'created_at']
    ordering = ['-planned_date']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TransportRouteCreateSerializer
        return TransportRouteSerializer


class TransportRouteDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, delete transport route"""
    queryset = TransportRoute.objects.select_related(
        'material', 'created_by'
    ).prefetch_related('history').all()
    serializer_class = TransportRouteSerializer
    permission_classes = [IsAdminOrReadOnly]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return TransportRouteCreateSerializer
        return TransportRouteSerializer


class TransportHistoryListCreateView(generics.ListCreateAPIView):
    """List and create transport history"""
    queryset = TransportHistory.objects.select_related('route', 'updated_by').all()
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['route', 'status']
    search_fields = ['location', 'notes']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TransportHistoryCreateSerializer
        return TransportHistorySerializer


class TransportHistoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, delete transport history"""
    queryset = TransportHistory.objects.select_related('route', 'updated_by').all()
    serializer_class = TransportHistorySerializer
    permission_classes = [IsAdminOrReadOnly]


@api_view(['GET'])
@permission_classes([IsAdminOrReadOnly])
def route_statistics(request):
    """Get transport route statistics"""
    total_routes = TransportRoute.objects.count()
    by_status = {}
    for status_code, status_name in TransportRoute.STATUS_CHOICES:
        by_status[status_name] = TransportRoute.objects.filter(status=status_code).count()
    
    # Routes by material
    routes_by_material = TransportRoute.objects.values(
        'material__name'
    ).annotate(count=Count('id')).order_by('-count')[:10]
    
    return Response({
        'total_routes': total_routes,
        'by_status': by_status,
        'routes_by_material': list(routes_by_material),
    })


@api_view(['GET'])
@permission_classes([IsAdminOrReadOnly])
def route_by_material(request, material_id):
    """Get all routes for a specific material"""
    routes = TransportRoute.objects.filter(material_id=material_id).select_related(
        'material', 'created_by'
    ).prefetch_related('history')
    serializer = TransportRouteSerializer(routes, many=True)
    return Response(serializer.data)


