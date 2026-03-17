@echo off
TITLE Validex UP - Sistema de Arranque Seguro
COLOR 0B

echo ======================================================
echo    Validex UP - Blindaje de Entorno Local
echo ======================================================
echo.

:: 1. Limpieza de procesos fantasma
echo [1/4] Limpiando procesos previos (Python, Node, Uvicorn)...
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM python.exe /T 2>nul
taskkill /F /IM uvicorn.exe /T 2>nul
echo. OK.

:: 2. Eliminacion de archivos de bloqueo de Next.js
echo [2/4] Eliminando archivos de bloqueo de Next.js...
if exist "validex_ui\.next\dev\lock" (
    del /f /q "validex_ui\.next\dev\lock"
    echo. Archivo de bloqueo eliminado.
) else (
    echo. No hay archivos de bloqueo pendientes.
)
echo. OK.

:: 3. Arranque del Backend (Python 3.12 Forzado)
echo [3/4] Lanzando Backend en ventana independiente...
start "Validex BACKEND" powershell -Command "Set-Location backend; .\venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000"
echo. OK.

:: 4. Arranque del Frontend (Next.js)
echo [4/4] Lanzando Frontend en ventana independiente...
start "Validex FRONTEND" powershell -Command "Set-Location validex_ui; npm run dev"
echo. OK.

echo ======================================================
echo    PROYECTO INICIADO EXITOSAMENTE
echo ======================================================
echo.
echo No cierres esta ventana si quieres ver el estado general.
echo Los servidores estan corriendo en:
echo - Backend: http://localhost:8000
echo - Frontend: http://localhost:3000
echo.
pause
