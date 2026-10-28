@echo off
title ICSE Class 10 Biology 3D Interactive Academic Learning Platform
echo =========================================================================
echo   Starting ICSE Class 10 Biology 3D Interactive Academic Learning Platform
echo =========================================================================
echo.
echo [1/2] Verifying Python and Node environment...
cd /d "%~dp0backend"
start "" http://localhost:8000/
echo [2/2] Launching unified full-stack server on http://localhost:8000/ ...
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
pause
