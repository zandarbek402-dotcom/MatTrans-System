from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom User model with role field"""
    ROLE_CHOICES = [
        ('admin', 'Администратор'),
        ('user', 'Пайдаланушы'),
    ]
    
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='user',
        verbose_name='Рөл'
    )
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name='Телефон')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Құрылған уақыты')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Жаңартылған уақыты')
    
    class Meta:
        verbose_name = 'Пайдаланушы'
        verbose_name_plural = 'Пайдаланушылар'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.username
    
    @property
    def is_admin(self):
        return self.role == 'admin' or self.is_superuser


