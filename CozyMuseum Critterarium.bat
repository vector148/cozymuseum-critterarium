@echo off
setlocal
title CozyMuseum Critterarium

cd /d "%~dp0"

echo ===================================================
echo       Welcome to CozyMuseum Critterarium!
echo ===================================================
echo.

:: 1. Kiem tra Node.js - Neu thieu tu dong tai va cai dat qua winget
where node >nul 2>nul
if %errorlevel% equ 0 goto check_modules

echo [System Check] Node.js is missing!
echo CozyMuseum Critterarium needs Node.js to run.
echo Installing Node.js automatically via Windows Package Manager (winget)...
echo.
winget install --id OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements
if %errorlevel% neq 0 winget install OpenJS.NodeJS

echo.
echo [System Check] Node.js installation finished!
echo Please CLOSE this window and double-click the launcher again to start.
pause
exit /b 0

:check_modules
:: 2. Kiem tra thu vien node_modules - Neu thieu tu dong tai ve ngay
if exist "node_modules" goto start_app

echo [First-time Setup] Downloading and installing required packages (npm install)...
echo Please wait a moment...
echo.
call npm install --no-audit --no-fund
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to install packages. Please check your internet connection.
    pause
    exit /b 1
)
echo [First-time Setup] Packages installed successfully!
echo.

:start_app
:: 3. Khoi dong CozyMuseum Critterarium va tu dong mo trinh duyet
echo Starting CozyMuseum Critterarium and opening your web browser...
echo.
echo ---------------------------------------------------
echo  Note: Please keep this window open while using.
echo  To exit the app, simply close this window.
echo ---------------------------------------------------
echo.

node scripts\dev.mjs %*

set "EXIT_CODE=%ERRORLEVEL%"
if not "%EXIT_CODE%"=="0" (
    echo.
    echo CozyMuseum Critterarium could not start. Please check the error messages above.
    pause
)

endlocal & exit /b %EXIT_CODE%
