from rest_framework import serializers
from .models import Material, MaterialCategory
from accounts.serializers import UserSerializer


class MaterialCategorySerializer(serializers.ModelSerializer):
    """Serializer for MaterialCategory"""
    class Meta:
        model = MaterialCategory
        fields = ['id', 'name', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']


class MaterialSerializer(serializers.ModelSerializer):
    """Serializer for Material"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Material
        fields = [
            'id', 'name', 'description', 'category', 'category_name',
            'quantity', 'unit', 'price_per_unit', 'status',
            'location', 'supplier', 'delivery_date',
            'created_by', 'created_by_username',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']


class MaterialCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating Material"""
    class Meta:
        model = Material
        fields = [
            'name', 'description', 'category',
            'quantity', 'unit', 'price_per_unit', 'status',
            'location', 'supplier', 'delivery_date'
        ]
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


