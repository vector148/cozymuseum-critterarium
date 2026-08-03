@echo off
setlocal
title CozyMuseum Launcher

echo ==========================================
echo       Welcome to CozyMuseum!
echo ==========================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [System Check] Node.js is missing!
    echo CozyMuseum needs Node.js to run. Don't worry, we'll install it for you.
    echo Please grant permission if a window pops up...
    echo.
    winget install OpenJS.NodeJS
    echo.
    echo Node.js installation finished! 
    echo IMPORTANT: Please CLOSE this window and double-click CozyMuseum.bat again to start.
    pause
    exit /b
)

:: Ensure we are in the script's directory (which is now the root of the repo)
cd /d "%~dp0"

:: Start the dev launcher
node scripts\dev.mjs %*

set "EXIT_CODE=%ERRORLEVEL%"
if not "%EXIT_CODE%"=="0" (
  echo.
  echo CozyMuseum could not start. Check the messages above.
  pause
)
endlocal & exit /b %EXIT_CODE%
