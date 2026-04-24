from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Material


@receiver(post_save, sender=Material)
def update_material_status(sender, instance, created, **kwargs):
    """Материал сақталған кезде сигнал"""
    pass


