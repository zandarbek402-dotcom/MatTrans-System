@echo off
echo ====================================
echo ConMat Transport - Backend Server
echo ====================================
echo.

cd backend

echo Checking virtual environment...
if not exist "..\venv\Scripts\activate.bat" (
    echo Creating virtual environment...
    cd ..
    python -m venv venv
    cd backend
)

echo Activating virtual environment...
call ..\venv\Scripts\activate.bat

echo Installing dependencies...
pip install -r ..\requirements.txt

echo.
echo Running migrations...
python manage.py migrate

echo.
echo Starting Django development server...
echo Backend will be available at http://localhost:8000
echo.
python manage.py runserver

pause


