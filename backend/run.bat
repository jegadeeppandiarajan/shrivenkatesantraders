@echo off
REM ============================================
REM SHRI VENKATESAN TRADERS - Backend Startup
REM ============================================

echo.
echo 🏭 Shri Venkatesan Traders - Backend Setup
echo.

REM Check if .env exists
if not exist ".env" (
    echo ❌ .env file not found!
    echo.
    echo Creating .env from template...
    copy .env.example .env
    echo.
    echo ✅ .env file created. Please edit it with your configuration:
    echo    - MongoDB URI
    echo    - Google OAuth credentials
    echo    - Stripe API keys
    echo.
    pause
    start .env
    exit /b
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo ⏳ Installing dependencies...
    call npm install
    echo.
)

REM Start the server
echo ✅ Starting backend server...
echo.
call npm run dev
