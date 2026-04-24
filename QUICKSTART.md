# ConMat Transport - Жылдам бастау

## Проектті іске қосу (қысқаша нұсқау)

### 1. Backend орнату

```powershell
# Виртуалды ортаны құру
python -m venv venv

# Виртуалды ортаны іске қосу
venv\Scripts\activate

# Тәуелділіктерді орнату
pip install -r requirements.txt
```

### 2. Дерекқорды дайындау

PostgreSQL серверін іске қосыңыз және дерекқорды құрыңыз:

```sql
CREATE DATABASE conmat_transport;
```

### 3. Environment файлын тексеру

`.env` файлын құрып, мына параметрлерді орнатыңыз:

```
SECRET_KEY=django-insecure-dev-key-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=conmat_transport
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

### 4. Backend миграциялары

```powershell
cd backend
python manage.py migrate
python manage.py createsuperuser
```

### 5. Frontend орнату

```powershell
cd frontend
npm install
```

### 6. Серверлерді іске қосу

**Терминал 1 (Backend):**
```powershell
cd backend
python manage.py runserver
```

**Терминал 2 (Frontend):**
```powershell
cd frontend
npm start
```

### 7. Браузерде ашу

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Django Admin: http://localhost:8000/admin

## Docker арқылы іске қосу (қарапайым)

```powershell
docker-compose up -d
```

Миграциялар:
```powershell
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

## Көмек

Мәселелер туындаған жағдайда `SETUP.md` файлын қараңыз.


