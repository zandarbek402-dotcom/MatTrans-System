# ConMat Transport

Құрылыс материалын тасымалдауды есепке алу жүйесі

## Сипаттама

ConMat Transport - бұл құрылыс материалдарын тасымалдауды және олардың қозғалысын есепке алуды автоматтандыруға арналған жүйе. Жүйе құрылыс материалдарының жеткізілуін бақылауға, маршруттар мен тасымал деректерін басқаруға және пайдаланушыларға тиімді есеп беру мүмкіндігін береді.

## Негізгі мүмкіндіктер

- ✅ Пайдаланушы аутентификациясы (тіркелу, кіру, шығу)
- ✅ Рөлдерді басқару (Администратор және Пайдаланушы)
- ✅ Құрылыс материалдарын басқару (CRUD операциялары)
- ✅ Тасымал маршруттарын басқару
- ✅ Материалдардың қозғалыс тарихын бақылау
- ✅ Іздеу және сүзгілеу мүмкіндіктері
- ✅ Адаптивті интерфейс (десктоп + мобильді)
- ✅ RESTful API
- ✅ Деректерді валидациялау және қателерді өңдеу

## Технологиялар

### Backend
- Django 4.2.7
- Django REST Framework
- PostgreSQL
- JWT Authentication
- Gunicorn

### Frontend
- React 18.2
- React Router
- Axios
- CSS3 (Responsive Design)

### DevOps
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- PostgreSQL

## Орнату

### Алғышарттар

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Docker (опционалды)

### Локальды орнату

1. Репозиторийді клонилау:
```bash
git clone <repository-url>
cd conmat_transport
```

2. Backend орнату:

```bash
# Виртуалды ортаны құру
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

# Тәуелділіктерді орнату
pip install -r requirements.txt

# Environment файлын құру
cp .env.example .env
# .env файлын өңдеп, дерекқор параметрлерін орнатыңыз

# Миграцияларды орындау
cd backend
python manage.py migrate

# Суперпайдаланушыны құру
python manage.py createsuperuser

# Статикалық файлдарды жинау
python manage.py collectstatic --noinput
```

3. Frontend орнату:

```bash
cd frontend
npm install
```

4. Дерекқорды бастау:

PostgreSQL серверін іске қосыңыз және `.env` файлындағы параметрлерді орнатыңыз.

5. Серверлерді іске қосу:

```bash
# Backend (бір терминалда)
cd backend
python manage.py runserver

# Frontend (басқа терминалда)
cd frontend
npm start
```

Backend: http://localhost:8000
Frontend: http://localhost:3000

### Docker арқылы орнату

1. Docker Compose арқылы іске қосу:

```bash
docker-compose up -d
```

2. Миграцияларды орындау:

```bash
docker-compose exec backend python manage.py migrate
```

3. Суперпайдаланушыны құру:

```bash
docker-compose exec backend python manage.py createsuperuser
```

## API Документациясы

### Аутентификация

- `POST /api/auth/register/` - Тіркелу
- `POST /api/auth/login/` - Кіру
- `POST /api/auth/logout/` - Шығу
- `GET /api/auth/profile/` - Профильді алу
- `PUT /api/auth/profile/` - Профильді жаңарту

### Материалдар

- `GET /api/materials/` - Материалдар тізімін алу
- `POST /api/materials/` - Жаңа материал қосу (Admin)
- `GET /api/materials/{id}/` - Материал ақпаратын алу
- `PUT /api/materials/{id}/` - Материалды өңдеу (Admin)
- `DELETE /api/materials/{id}/` - Материалды жою (Admin)
- `GET /api/materials/statistics/` - Статистика

### Тасымал маршруттары

- `GET /api/transport/routes/` - Маршруттар тізімін алу
- `POST /api/transport/routes/` - Жаңа маршрут қосу (Admin)
- `GET /api/transport/routes/{id}/` - Маршрут ақпаратын алу
- `PUT /api/transport/routes/{id}/` - Маршрутты өңдеу (Admin)
- `DELETE /api/transport/routes/{id}/` - Маршрутты жою (Admin)
- `GET /api/transport/routes/statistics/` - Статистика

## Пайдаланушы рөлдері

### Администратор
- Барлық материалдарды қосу, өңдеу, жою
- Тасымал маршруттарын басқару
- Барлық пайдаланушыларды көру

### Пайдаланушы
- Материалдарды көру
- Тасымалдауды бақылау
- Өз профилін өңдеу

## Дерекқор моделдері

### User (Пайдаланушы)
- username, email, password
- role (admin/user)
- phone, first_name, last_name

### Material (Материал)
- name, description
- category, quantity, unit
- status, location, supplier
- delivery_date, price_per_unit

### TransportRoute (Тасымал маршруты)
- material (ForeignKey)
- origin_location, destination_location
- quantity, transport_company
- driver_name, driver_phone, vehicle_number
- planned_date, actual_date, status

### TransportHistory (Тасымал тарихы)
- route (ForeignKey)
- location, status, notes
- updated_by, created_at

## Деплой

### Heroku

1. Heroku CLI орнатыңыз
2. Heroku қосымшасын құрыңыз
3. PostgreSQL addon қосыңыз
4. Environment айнымалыларын орнатыңыз
5. Деплой етіңіз

### AWS/Azure

Docker контейнерлерін пайдаланып, AWS ECS немесе Azure Container Instances арқылы деплой етуге болады.

## Қатысушылар

Бұл жобаны дамытуға қатысқан барлық адамдарға рахмет!

## Лицензия

MIT License

## Байланыс

Сұрақтар мен ұсыныстар үшін issue ашыңыз.


