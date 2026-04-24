# ConMat Transport - Орнату нұсқаулығы

## Алғышарттар

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Git

## Қадамдық орнату

### 1. Репозиторийді клонилау

```bash
git clone <repository-url>
cd conmat_transport
```

### 2. Backend орнату

#### Windows:

```powershell
# Виртуалды ортаны құру
python -m venv venv

# Виртуалды ортаны іске қосу
venv\Scripts\activate

# Тәуелділіктерді орнату
pip install -r requirements.txt
```

#### Linux/Mac:

```bash
# Виртуалды ортаны құру
python3 -m venv venv

# Виртуалды ортаны іске қосу
source venv/bin/activate

# Тәуелділіктерді орнату
pip install -r requirements.txt
```

### 3. Дерекқорды дайындау

PostgreSQL серверін іске қосыңыз және дерекқорды құрыңыз:

```sql
CREATE DATABASE conmat_transport;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE conmat_transport TO postgres;
```

### 4. Environment файлын құру

`.env.example` файлын `.env` деп көшіріп, параметрлерді өзгертіңіз:

```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

`.env` файлын ашып, дерекқор параметрлерін орнатыңыз:

```
SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=conmat_transport
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

### 5. Backend миграциялары

```bash
cd backend
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic --noinput
```

### 6. Frontend орнату

```bash
cd frontend
npm install
```

### 7. Серверлерді іске қосу

#### Backend (бір терминалда):

```bash
cd backend
python manage.py runserver
```

Backend: http://localhost:8000

#### Frontend (басқа терминалда):

```bash
cd frontend
npm start
```

Frontend: http://localhost:3000

## Docker арқылы орнату

### 1. Docker Compose арқылы іске қосу

```bash
docker-compose up -d
```

### 2. Миграцияларды орындау

```bash
docker-compose exec backend python manage.py migrate
```

### 3. Суперпайдаланушыны құру

```bash
docker-compose exec backend python manage.py createsuperuser
```

### 4. Логтарды көру

```bash
docker-compose logs -f backend
```

### 5. Тоқтату

```bash
docker-compose down
```

## Тестілеу

### Backend тесттерін іске қосу:

```bash
cd backend
python manage.py test
```

### Frontend тесттерін іске қосу:

```bash
cd frontend
npm test
```

## Мәселелерді шешу

### PostgreSQL қосылу қатесі

- PostgreSQL серверінің іске қосылғанын тексеріңіз
- `.env` файлындағы дерекқор параметрлерін тексеріңіз
- Дерекқордың құрылғанын тексеріңіз

### Port бос емес

- Басқа портты пайдаланыңыз немесе портты пайдаланатын басқа қосымшаны тоқтатыңыз

### Module not found қатесі

- Виртуалды ортаның іске қосылғанын тексеріңіз
- `pip install -r requirements.txt` командасын қайта орындаңыз

## Көмек

Мәселелер туындаған жағдайда, issue ашыңыз немесе құжаттаманы қараңыз.


