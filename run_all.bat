@echo off
TITLE PDF to Excel SaaS Launcher
echo ==========================================
echo   Any File Converter - Project Launcher
echo ==========================================
echo.

echo [1/2] Starting Backend (FastAPI)...
start "Backend - FastAPI" cmd /k "cd backend && .\venv\Scripts\activate && python main.py"

echo [2/2] Starting Frontend (Next.js)...
start "Frontend - Next.js" cmd /k "cd frontend && npm run dev"

echo.
echo ==========================================
echo   ALL SYSTEMS STARTING UP!
echo ==========================================
echo   Frontend: http://localhost:3000 or 3001
echo   Backend:  http://localhost:8000
echo ==========================================
echo.
pause
