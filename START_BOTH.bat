@echo off
echo ====================================
echo Tiarkhali M.M High School System
echo ====================================
echo.
echo Starting API Server and Frontend...
echo.
echo API Server: http://localhost:3001
echo Frontend: http://localhost:5173 (or next available port)
echo.
echo Press Ctrl+C to stop both servers
echo.

start "API Server" cmd /k "npm run server:watch"
timeout /t 3 /nobreak > nul
start "Frontend Dev" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Check the new terminal windows for logs
echo.
pause
