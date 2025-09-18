@echo off
REM One-click dev runner: SUMO GUI, controller, AI, backend, frontend
setlocal ENABLEDELAYEDEXPANSION

set ROOT=%~dp0

REM Resolve SUMO binary
set SUMO_BIN=sumo-gui.exe
if defined SUMO_HOME (
  if exist "%SUMO_HOME%\bin\sumo-gui.exe" set SUMO_BIN="%SUMO_HOME%\bin\sumo-gui.exe"
)

REM Launch SUMO GUI (keep window open with /k, auto-start simulation)
start "SUMO" cmd /k "cd /d %ROOT%sumo && %SUMO_BIN% -c city.sumocfg --remote-port 8873 --delay 350 --start"

REM Controller
start "Controller" cmd /k "cd /d %ROOT%services\python-controller && python app.py"

REM AI
start "AI" cmd /k "cd /d %ROOT%services\python-ai && python app.py"

REM Backend
start "Backend" cmd /k "cd /d %ROOT%backend && npm start"

REM Frontend
start "Frontend" cmd /k "cd /d %ROOT%frontend && npm run dev"

REM Give Vite a moment, then open the browser
timeout /t 3 /nobreak >nul
start "Browser" http://localhost:5173/

echo Launched all services in separate windows. You can close this small window now.
exit /b 0