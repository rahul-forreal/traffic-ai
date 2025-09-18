@echo off
echo Starting MARG Emergency Management System...
echo.

echo Starting Backend Server (Port 4000)...
start "Backend" cmd /k "cd backend && npm start"

echo Starting Frontend Server (Port 5173)...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo Starting Python AI Service (Port 5002)...
start "Python AI" cmd /k "cd services/python-ai && python app.py"

echo Starting Python Controller Service (Port 5001)...
start "Python Controller" cmd /k "cd services/python-controller && python app.py"

echo Starting SUMO Simulation...
start "SUMO" cmd /k "cd sumo && sumo-gui -c city.sumo.cfg --remote-port 8873"

echo.
echo All services are starting...
echo Backend: http://localhost:4000
echo Frontend: http://localhost:5173
echo Python AI: http://localhost:5002
echo Python Controller: http://localhost:5001
echo SUMO: Running on port 8873
echo.
echo Press any key to exit...
pause >nul
