from django.db import models
from django.contrib.auth import get_user_model
from materials.models import Material

User = get_user_model()


class TransportRoute(models.Model):
    """Transport route model"""
    STATUS_CHOICES = [
        ('planned', 'Жоспарланған'),
        ('in_transit', 'Тасымалдауда'),
        ('completed', 'Аяқталған'),
        ('cancelled', 'Бас тартылған'),
    ]
    
    material = models.ForeignKey(
        Material,
        on_delete=models.CASCADE,
        related_name='transport_routes',
        verbose_name='Материал'
    )
    origin_location = models.CharField(max_length=200, verbose_name='Бастапқы орналасқан жері')
    destination_location = models.CharField(max_length=200, verbose_name='Мақсатты орналасқан жері')
    quantity = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Тасымалданатын саны')
    transport_company = models.CharField(max_length=200, blank=True, null=True, verbose_name='Тасымалдаушы компания')
    driver_name = models.CharField(max_length=100, blank=True, null=True, verbose_name='Жүргізуші аты')
    driver_phone = models.CharField(max_length=20, blank=True, null=True, verbose_name='Жүргізуші телефоны')
    vehicle_number = models.CharField(max_length=50, blank=True, null=True, verbose_name='Көлік нөмірі')
    planned_date = models.DateTimeField(verbose_name='Жоспарланған күні')
    actual_date = models.DateTimeField(blank=True, null=True, verbose_name='Нақты күні')
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='planned',
        verbose_name='Күйі'
    )
    notes = models.TextField(blank=True, null=True, verbose_name='Ескертпелер')
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_routes',
        verbose_name='Құрған пайдаланушы'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Құрылған уақыты')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Жаңартылған уақыты')
    
    class Meta:
        verbose_name = 'Тасымал маршруты'
        verbose_name_plural = 'Тасымал маршруттары'
        ordering = ['-planned_date']
    
    def __str__(self):
        return f"{self.material.name}: {self.origin_location} -> {self.destination_location}"


class TransportHistory(models.Model):
    """Transport history tracking model"""
    route = models.ForeignKey(
        TransportRoute,
        on_delete=models.CASCADE,
        related_name='history',
        verbose_name='Маршрут'
    )
    location = models.CharField(max_length=200, verbose_name='Орналасқан жері')
    status = models.CharField(max_length=50, verbose_name='Күйі')
    notes = models.TextField(blank=True, null=True, verbose_name='Ескертпелер')
    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='transport_updates',
        verbose_name='Жаңартқан пайдаланушы'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Уақыты')
    
    class Meta:
        verbose_name = 'Тасымал тарихы'
        verbose_name_plural = 'Тасымал тарихы'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.route} - {self.location} ({self.created_at})"


