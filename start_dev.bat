@echo off
echo ============================================================
echo Cargill Ocean Transportation - Development Server
echo ============================================================
echo.
echo Starting FastAPI backend on port 8000...
echo Starting Vite frontend on port 5173...
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop both servers.
echo ============================================================

:: Start backend in new window (API key loaded from .env file)
:: Use conda activate to ensure correct Python environment is used
start "Cargill API" cmd /k "cd /d %~dp0 && call conda activate base && python -m uvicorn api.main:app --reload --port 8000"

:: Wait a moment for backend to start
timeout /t 3 /nobreak > nul

:: Start frontend in new window
start "Cargill UI" cmd /k "cd /d %~dp0\frontend && npm run dev"

echo.
echo Servers starting in separate windows...
echo.
pause
