@echo off
echo Starting 3D Homepage Development Server...
echo.
echo Please wait while the server starts...
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed! Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Set execution policy for npm
powershell -Command "Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force"

:: Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo Failed to install dependencies!
        pause
        exit /b 1
    )
)

:: Start the development server
echo Starting server...
call npm run dev

pause