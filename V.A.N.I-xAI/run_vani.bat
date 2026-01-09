@echo off
REM V.A.N.I-xAI Desktop Application Launcher
REM This script starts the Flask backend and opens the web interface

echo.
echo ========================================
echo    V.A.N.I-xAI - Advanced AI Assistant
echo ========================================
echo.

REM Change to the app directory
cd /d "%~dp0"

REM Start the Python launcher
python run_vani.py

pause
