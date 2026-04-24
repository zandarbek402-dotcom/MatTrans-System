from django.test import TestCase
from django.contrib.auth import get_user_model
from materials.models import Material, MaterialCategory
from .models import TransportRoute

User = get_user_model()


class TransportRouteModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.category = MaterialCategory.objects.create(name='Test Category')
        self.material = Material.objects.create(
            name='Test Material',
            quantity=100,
            unit='kg',
            created_by=self.user,
            category=self.category
        )

    def test_create_route(self):
        route = TransportRoute.objects.create(
            material=self.material,
            origin_location='Location A',
            destination_location='Location B',
            quantity=50,
            planned_date='2024-01-01T10:00:00Z',
            created_by=self.user
        )
        self.assertEqual(route.origin_location, 'Location A')
        self.assertEqual(route.status, 'planned')


