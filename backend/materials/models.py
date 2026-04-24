from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class MaterialCategory(models.Model):
    """Material category model"""
    name = models.CharField(max_length=100, verbose_name='Атауы')
    description = models.TextField(blank=True, null=True, verbose_name='Сипаттама')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Құрылған уақыты')
    
    class Meta:
        verbose_name = 'Материал санаты'
        verbose_name_plural = 'Материал санаттары'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Material(models.Model):
    """Construction material model"""
    UNIT_CHOICES = [
        ('kg', 'Килограмм'),
        ('ton', 'Тонна'),
        ('m3', 'Кубикалық метр'),
        ('m2', 'Шаршы метр'),
        ('piece', 'Дана'),
        ('pack', 'Пакет'),
    ]
    
    STATUS_CHOICES = [
        ('available', 'Қолжетімді'),
        ('in_transit', 'Тасымалдауда'),
        ('delivered', 'Жеткізілген'),
        ('reserved', 'Резервтелген'),
    ]
    
    name = models.CharField(max_length=200, verbose_name='Атауы')
    description = models.TextField(blank=True, null=True, verbose_name='Сипаттама')
    category = models.ForeignKey(
        MaterialCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='materials',
        verbose_name='Санаты'
    )
    quantity = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Саны')
    unit = models.CharField(max_length=20, choices=UNIT_CHOICES, default='piece', verbose_name='Өлшем бірлігі')
    price_per_unit = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        verbose_name='Бірлік бағасы'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='available',
        verbose_name='Күйі'
    )
    location = models.CharField(max_length=200, blank=True, null=True, verbose_name='Орналасқан жері')
    supplier = models.CharField(max_length=200, blank=True, null=True, verbose_name='Жеткізуші')
    delivery_date = models.DateField(blank=True, null=True, verbose_name='Жеткізу күні')
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_materials',
        verbose_name='Құрған пайдаланушы'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Құрылған уақыты')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Жаңартылған уақыты')
    
    class Meta:
        verbose_name = 'Құрылыс материалы'
        verbose_name_plural = 'Құрылыс материалдары'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.quantity} {self.get_unit_display()})"


