@echo off
echo ========================================
echo    LSTM Earthquake Forecasting System
echo ========================================
echo.
echo Starting LSTM Backend...
echo.

cd src\Backend
start "LSTM Backend" python main.py

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo Starting React Frontend...
echo.

cd ..\..
start "React Frontend" npm run dev

echo.
echo ========================================
echo    System Starting...
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause > nul


