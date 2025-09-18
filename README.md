# Emergency Ambulance Dispatch & Traffic Management (Hackathon Demo)

## Run Order
1. One-click (Windows): run go.bat in repo root (see below)
2. Or manual:
   - SUMO: sumo-gui -c sumo/city.sumo.cfg --remote-port 8873
   - Controller: cd services/python-controller && python app.py
   - AI: cd services/python-ai && python app.py
   - Backend: cd backend && npm start
   - Frontend: cd frontend && npm run dev

## URLs
- Frontend: http://localhost:5173/
- Backend: http://localhost:4000/
- Controller: http://localhost:5001/
- AI: http://localhost:5002/

## Socket.IO Events
- ambulanceAssigned, ambulanceRequest, ambulanceAccepted, locationUpdate
- signalModeChange, override, emergencyCompleted

## One-click dev runner (Windows)

Run all parts with one command:


go.bat


This opens 5 terminals:
- SUMO-GUI with city.sumo.cfg on --remote-port 8873
- Python controller (port 5001)
- Python AI (port 5002)
- Node backend (port 4000)
- React frontend (port 5173)

If a window closes immediately, open its service manually to see errors.

## Notes
- Data stored in backend/data/*.json.