from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Material, MaterialCategory

User = get_user_model()


class MaterialModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.category = MaterialCategory.objects.create(
            name='Test Category',
            description='Test Description'
        )

    def test_create_material(self):
        material = Material.objects.create(
            name='Test Material',
            quantity=100,
            unit='kg',
            created_by=self.user,
            category=self.category
        )
        self.assertEqual(material.name, 'Test Material')
        self.assertEqual(material.quantity, 100)
        self.assertEqual(material.status, 'available')


