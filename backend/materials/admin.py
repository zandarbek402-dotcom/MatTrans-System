from django.contrib import admin
from .models import Material, MaterialCategory


@admin.register(MaterialCategory)
class MaterialCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'quantity', 'unit', 'status', 'location', 'created_at']
    list_filter = ['status', 'category', 'unit', 'created_at']
    search_fields = ['name', 'description', 'location', 'supplier']
    readonly_fields = ['created_at', 'updated_at']


