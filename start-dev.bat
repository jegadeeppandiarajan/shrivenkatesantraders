@echo off
echo ============================================
echo  Shri Venkatesan Traders - Development
echo ============================================
echo.
echo Starting Backend on http://localhost:5000
echo Starting Frontend on http://localhost:3000
echo.
echo Press Ctrl+C to stop all servers
echo ============================================
echo.

start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start "Frontend Server" cmd /k "cd frontend && npm run dev"
