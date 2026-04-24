"""
Management command to seed initial data
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from materials.models import MaterialCategory, Material
from transport.models import TransportRoute, TransportHistory
from datetime import datetime, timedelta
import random

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed database with initial data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Бастапқы деректерді енгізу басталды...'))

        # Суперпайдаланушыны құру
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@conmat.kz',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('✓ Суперпайдаланушы құрылды'))

        # Қарапайым пайдаланушыны құру
        user1, created = User.objects.get_or_create(
            username='user1',
            defaults={
                'email': 'user1@conmat.kz',
                'role': 'user',
                'first_name': 'Асқар',
                'last_name': 'Қасымов',
                'phone': '+7 777 123 4567',
            }
        )
        if created:
            user1.set_password('user123')
            user1.save()
            self.stdout.write(self.style.SUCCESS('✓ Пайдаланушы құрылды'))

        # Материал санаттарын құру
        categories_data = [
            {'name': 'Бетон және қоспалар', 'description': 'Бетон, цемент, құм, қиыршық тас'},
            {'name': 'Металл бұйымдары', 'description': 'Арматура, бұрандалар, бұрамалар'},
            {'name': 'Ағаш материалдары', 'description': 'Тақтай, брус, фанера'},
            {'name': 'Құрылыс блоктары', 'description': 'Кірпіш, газобетон, керамзит блоктары'},
            {'name': 'Жылу оқшаулау материалдары', 'description': 'Минералды мата, пенопласт, экструзия'},
            {'name': 'Еден және төбе материалдары', 'description': 'Ламинат, паркет, төбе панельдері'},
            {'name': 'Сантехника', 'description': 'Трубалар, фитингтер, арматура'},
            {'name': 'Электр материалдары', 'description': 'Кабель, розеткалар, қосқыштар'},
        ]

        categories = {}
        for cat_data in categories_data:
            category, created = MaterialCategory.objects.get_or_create(
                name=cat_data['name'],
                defaults={'description': cat_data['description']}
            )
            categories[cat_data['name']] = category
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Санат құрылды: {cat_data["name"]}'))

        # Материалдарды құру
        materials_data = [
            # Бетон және қоспалар
            {'name': 'Бетон М300', 'category': 'Бетон және қоспалар', 'quantity': 150, 'unit': 'm3', 'price_per_unit': 25000, 'location': 'Алматы, Бетон зауыты №1', 'supplier': 'Бетон-Строй', 'status': 'available'},
            {'name': 'Цемент М500', 'category': 'Бетон және қоспалар', 'quantity': 500, 'unit': 'ton', 'price_per_unit': 45000, 'location': 'Алматы, Цемент қоймасы', 'supplier': 'Цемент-Казахстан', 'status': 'available'},
            {'name': 'Құм құрылыс', 'category': 'Бетон және қоспалар', 'quantity': 800, 'unit': 'm3', 'price_per_unit': 3500, 'location': 'Алматы, Құм карьері', 'supplier': 'Құм-Строй', 'status': 'available'},
            {'name': 'Қиыршық тас', 'category': 'Бетон және қоспалар', 'quantity': 600, 'unit': 'm3', 'price_per_unit': 4500, 'location': 'Алматы, Қиыршық тас карьері', 'supplier': 'Казахстан Карьер', 'status': 'in_transit'},
            
            # Металл бұйымдары
            {'name': 'Арматура А500С Ø12мм', 'category': 'Металл бұйымдары', 'quantity': 25, 'unit': 'ton', 'price_per_unit': 280000, 'location': 'Алматы, Металл қоймасы', 'supplier': 'Металл-Трейд', 'status': 'available'},
            {'name': 'Арматура А500С Ø16мм', 'category': 'Металл бұйымдары', 'quantity': 18, 'unit': 'ton', 'price_per_unit': 285000, 'location': 'Алматы, Металл қоймасы', 'supplier': 'Металл-Трейд', 'status': 'available'},
            {'name': 'Бұранда M12x50', 'category': 'Металл бұйымдары', 'quantity': 5000, 'unit': 'piece', 'price_per_unit': 45, 'location': 'Алматы, Крепеж қоймасы', 'supplier': 'Крепеж-Центр', 'status': 'available'},
            {'name': 'Бұрама M10x40', 'category': 'Металл бұйымдары', 'quantity': 3000, 'unit': 'piece', 'price_per_unit': 35, 'location': 'Алматы, Крепеж қоймасы', 'supplier': 'Крепеж-Центр', 'status': 'reserved'},
            
            # Ағаш материалдары
            {'name': 'Тақтай 50x150x6000', 'category': 'Ағаш материалдары', 'quantity': 200, 'unit': 'm3', 'price_per_unit': 85000, 'location': 'Алматы, Ағаш қоймасы', 'supplier': 'Ағаш-Строй', 'status': 'available'},
            {'name': 'Брус 150x150x6000', 'category': 'Ағаш материалдары', 'quantity': 80, 'unit': 'm3', 'price_per_unit': 95000, 'location': 'Алматы, Ағаш қоймасы', 'supplier': 'Ағаш-Строй', 'status': 'available'},
            {'name': 'Фанера 18мм', 'category': 'Ағаш материалдары', 'quantity': 150, 'unit': 'm2', 'price_per_unit': 2500, 'location': 'Алматы, Ағаш қоймасы', 'supplier': 'Ағаш-Строй', 'status': 'delivered'},
            
            # Құрылыс блоктары
            {'name': 'Кірпіш қызыл', 'category': 'Құрылыс блоктары', 'quantity': 50000, 'unit': 'piece', 'price_per_unit': 12, 'location': 'Алматы, Кірпіш зауыты', 'supplier': 'Кірпіш-Строй', 'status': 'available'},
            {'name': 'Газобетон блок 600x300x200', 'category': 'Құрылыс блоктары', 'quantity': 800, 'unit': 'm3', 'price_per_unit': 32000, 'location': 'Алматы, Блок зауыты', 'supplier': 'Блок-Строй', 'status': 'available'},
            {'name': 'Керамзит блок', 'category': 'Құрылыс блоктары', 'quantity': 400, 'unit': 'm3', 'price_per_unit': 28000, 'location': 'Алматы, Блок зауыты', 'supplier': 'Блок-Строй', 'status': 'in_transit'},
            
            # Жылу оқшаулау
            {'name': 'Минералды мата 100мм', 'category': 'Жылу оқшаулау материалдары', 'quantity': 300, 'unit': 'm2', 'price_per_unit': 1200, 'location': 'Алматы, Оқшаулау қоймасы', 'supplier': 'Тепло-Строй', 'status': 'available'},
            {'name': 'Пенопласт ПСБ-С25 100мм', 'category': 'Жылу оқшаулау материалдары', 'quantity': 500, 'unit': 'm2', 'price_per_unit': 1800, 'location': 'Алматы, Оқшаулау қоймасы', 'supplier': 'Тепло-Строй', 'status': 'available'},
            
            # Еден және төбе
            {'name': 'Ламинат 32 класс', 'category': 'Еден және төбе материалдары', 'quantity': 200, 'unit': 'm2', 'price_per_unit': 3500, 'location': 'Алматы, Еден материалдары', 'supplier': 'Еден-Центр', 'status': 'available'},
            {'name': 'Төбе панелі ПВХ', 'category': 'Еден және төбе материалдары', 'quantity': 150, 'unit': 'm2', 'price_per_unit': 2800, 'location': 'Алматы, Төбе материалдары', 'supplier': 'Төбе-Строй', 'status': 'delivered'},
            
            # Сантехника
            {'name': 'Труба ПВХ Ø110мм', 'category': 'Сантехника', 'quantity': 500, 'unit': 'm', 'price_per_unit': 850, 'location': 'Алматы, Сантехника қоймасы', 'supplier': 'Сантех-Строй', 'status': 'available'},
            {'name': 'Фитинг 90°', 'category': 'Сантехника', 'quantity': 200, 'unit': 'piece', 'price_per_unit': 450, 'location': 'Алматы, Сантехника қоймасы', 'supplier': 'Сантех-Строй', 'status': 'available'},
            
            # Электр материалдары
            {'name': 'Кабель ВВГ 3x2.5', 'category': 'Электр материалдары', 'quantity': 1000, 'unit': 'm', 'price_per_unit': 280, 'location': 'Алматы, Электр қоймасы', 'supplier': 'Электр-Строй', 'status': 'available'},
            {'name': 'Розетка европалық', 'category': 'Электр материалдары', 'quantity': 150, 'unit': 'piece', 'price_per_unit': 450, 'location': 'Алматы, Электр қоймасы', 'supplier': 'Электр-Строй', 'status': 'available'},
        ]

        materials = []
        for mat_data in materials_data:
            category = categories.get(mat_data['category'])
            if category:
                material, created = Material.objects.get_or_create(
                    name=mat_data['name'],
                    defaults={
                        'category': category,
                        'quantity': mat_data['quantity'],
                        'unit': mat_data['unit'],
                        'price_per_unit': mat_data.get('price_per_unit'),
                        'location': mat_data.get('location', ''),
                        'supplier': mat_data.get('supplier', ''),
                        'status': mat_data.get('status', 'available'),
                        'created_by': admin_user,
                        'delivery_date': datetime.now().date() + timedelta(days=random.randint(-30, 30)),
                    }
                )
                materials.append(material)
                if created:
                    self.stdout.write(self.style.SUCCESS(f'✓ Материал құрылды: {mat_data["name"]}'))

        # Тасымал маршруттарын құру
        locations = [
            'Алматы, Бетон зауыты №1',
            'Алматы, Цемент қоймасы',
            'Алматы, Құм карьері',
            'Алматы, Металл қоймасы',
            'Алматы, Ағаш қоймасы',
            'Алматы, Кірпіш зауыты',
            'Астана, Құрылыс алаңы №1',
            'Астана, Құрылыс алаңы №2',
            'Шымкент, Құрылыс алаңы',
            'Ақтөбе, Құрылыс алаңы',
            'Қарағанды, Құрылыс алаңы',
        ]

        route_statuses = ['planned', 'in_transit', 'completed', 'completed', 'completed']
        transport_companies = ['Транс-Логистик', 'Строй-Транс', 'Быстрый Доставка', 'Надежный Перевозчик', None]
        drivers = ['Иванов Иван', 'Петров Петр', 'Сидоров Сидор', 'Қасымов Асқар', None]

        routes_created = 0
        for i, material in enumerate(materials[:15]):  # Алғашқы 15 материал үшін
            origin = random.choice(locations)
            destination = random.choice([loc for loc in locations if loc != origin])
            status = random.choice(route_statuses)
            
            planned_date = datetime.now() + timedelta(days=random.randint(-10, 10))
            actual_date = None
            if status == 'completed':
                actual_date = planned_date + timedelta(hours=random.randint(2, 48))
            
            route, created = TransportRoute.objects.get_or_create(
                material=material,
                origin_location=origin,
                destination_location=destination,
                defaults={
                    'quantity': material.quantity * random.uniform(0.3, 0.8),
                    'transport_company': random.choice(transport_companies),
                    'driver_name': random.choice(drivers),
                    'driver_phone': f'+7 777 {random.randint(100, 999)} {random.randint(1000, 9999)}' if random.choice(drivers) else None,
                    'vehicle_number': f'А{random.randint(100, 999)}АА{random.randint(10, 99)}',
                    'planned_date': planned_date,
                    'actual_date': actual_date,
                    'status': status,
                    'notes': f'Материал {material.name} тасымалдау',
                    'created_by': admin_user,
                }
            )
            
            if created:
                routes_created += 1
                # Тарих құру
                if status != 'planned':
                    TransportHistory.objects.create(
                        route=route,
                        location=origin,
                        status='planned',
                        notes='Маршрут құрылды',
                        updated_by=admin_user,
                    )
                    TransportHistory.objects.create(
                        route=route,
                        location='Жолда',
                        status='in_transit',
                        notes='Тасымалдау басталды',
                        updated_by=admin_user,
                    )
                    if status == 'completed':
                        TransportHistory.objects.create(
                            route=route,
                            location=destination,
                            status='completed',
                            notes='Тасымалдау аяқталды',
                            updated_by=admin_user,
                        )

        self.stdout.write(self.style.SUCCESS(f'✓ {routes_created} маршрут құрылды'))

        self.stdout.write(self.style.SUCCESS('\n✅ Барлық бастапқы деректер сәтті енгізілді!'))
        self.stdout.write(self.style.SUCCESS(f'\nҚұрылған деректер:'))
        self.stdout.write(self.style.SUCCESS(f'  - Санаттар: {MaterialCategory.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'  - Материалдар: {Material.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'  - Маршруттар: {TransportRoute.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'  - Тарих жазбалары: {TransportHistory.objects.count()}'))


