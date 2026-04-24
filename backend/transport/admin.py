from django.contrib import admin
from .models import TransportRoute, TransportHistory


class TransportHistoryInline(admin.TabularInline):
    model = TransportHistory
    extra = 0
    readonly_fields = ['created_at']


@admin.register(TransportRoute)
class TransportRouteAdmin(admin.ModelAdmin):
    list_display = ['material', 'origin_location', 'destination_location', 'status', 'planned_date', 'created_at']
    list_filter = ['status', 'planned_date', 'created_at']
    search_fields = ['material__name', 'origin_location', 'destination_location', 'transport_company', 'driver_name']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [TransportHistoryInline]


@admin.register(TransportHistory)
class TransportHistoryAdmin(admin.ModelAdmin):
    list_display = ['route', 'location', 'status', 'updated_by', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['route__material__name', 'location']
    readonly_fields = ['created_at']


