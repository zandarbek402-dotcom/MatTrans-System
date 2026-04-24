@echo off
echo ====================================
echo ConMat Transport - Project Setup
echo ====================================
echo.

echo Step 1: Creating virtual environment...
if not exist "venv" (
    python -m venv venv
    echo Virtual environment created!
) else (
    echo Virtual environment already exists!
)

echo.
echo Step 2: Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Step 3: Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Step 4: Installing Frontend dependencies...
cd frontend
if not exist "node_modules" (
    call npm install
    echo Frontend dependencies installed!
) else (
    echo Frontend dependencies already installed!
)
cd ..

echo.
echo Step 5: Setting up database...
cd backend
echo Running migrations...
python manage.py migrate

echo.
echo ====================================
echo Setup Complete!
echo ====================================
echo.
echo Next steps:
echo 1. Create a superuser: python manage.py createsuperuser
echo 2. Start backend: run start_backend.bat
echo 3. Start frontend: run start_frontend.bat (in another terminal)
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo Admin: http://localhost:8000/admin
echo.

pause


