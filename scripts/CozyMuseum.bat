@echo off
setlocal
title CozyMuseum
cd /d "%~dp0.."
node scripts\dev.mjs %*
set "EXIT_CODE=%ERRORLEVEL%"
if not "%EXIT_CODE%"=="0" (
  echo.
  echo CozyMuseum could not start. Check the message above.
  pause
)
endlocal & exit /b %EXIT_CODE%
