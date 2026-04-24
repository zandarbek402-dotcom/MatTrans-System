from rest_framework import serializers
from .models import TransportRoute, TransportHistory
from materials.serializers import MaterialSerializer
from accounts.serializers import UserSerializer


class TransportHistorySerializer(serializers.ModelSerializer):
    """Serializer for TransportHistory"""
    updated_by_username = serializers.CharField(source='updated_by.username', read_only=True)
    
    class Meta:
        model = TransportHistory
        fields = [
            'id', 'route', 'location', 'status', 'notes',
            'updated_by', 'updated_by_username', 'created_at'
        ]
        read_only_fields = ['id', 'updated_by', 'created_at']


class TransportRouteSerializer(serializers.ModelSerializer):
    """Serializer for TransportRoute"""
    material_detail = MaterialSerializer(source='material', read_only=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    history = TransportHistorySerializer(many=True, read_only=True)
    
    class Meta:
        model = TransportRoute
        fields = [
            'id', 'material', 'material_detail',
            'origin_location', 'destination_location',
            'quantity', 'transport_company', 'driver_name', 'driver_phone',
            'vehicle_number', 'planned_date', 'actual_date',
            'status', 'notes',
            'created_by', 'created_by_username',
            'created_at', 'updated_at', 'history'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']


class TransportRouteCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating TransportRoute"""
    class Meta:
        model = TransportRoute
        fields = [
            'material', 'origin_location', 'destination_location',
            'quantity', 'transport_company', 'driver_name', 'driver_phone',
            'vehicle_number', 'planned_date', 'actual_date',
            'status', 'notes'
        ]
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        route = super().create(validated_data)
        
        # Create initial history entry
        TransportHistory.objects.create(
            route=route,
            location=validated_data['origin_location'],
            status='planned',
            updated_by=self.context['request'].user,
            notes='Маршрут құрылды'
        )
        
        # Update material status if needed
        material = route.material
        if material.status == 'available':
            material.status = 'in_transit'
            material.save()
        
        return route


class TransportHistoryCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating TransportHistory"""
    class Meta:
        model = TransportHistory
        fields = ['route', 'location', 'status', 'notes']
    
    def create(self, validated_data):
        validated_data['updated_by'] = self.context['request'].user
        history = super().create(validated_data)
        
        # Update route status if completed
        route = history.route
        if history.status == 'completed' and route.status != 'completed':
            route.status = 'completed'
            route.actual_date = history.created_at
            route.save()
            
            # Update material status
            material = route.material
            material.status = 'delivered'
            material.location = route.destination_location
            material.save()
        
        return history


