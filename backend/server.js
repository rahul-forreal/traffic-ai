const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Simple status root
app.get('/', (req, res) => {
    res.json({ ok: true, service: 'backend', time: new Date().toISOString() });
});

const DATA_DIR = path.join(__dirname, 'data');
const USERS_PATH = path.join(DATA_DIR, 'users.json');
const AMB_PATH = path.join(DATA_DIR, 'ambulances.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(USERS_PATH)) fs.writeFileSync(USERS_PATH, JSON.stringify([]));
if (!fs.existsSync(AMB_PATH)) fs.writeFileSync(AMB_PATH, JSON.stringify([{ id: 'A1' }, { id: 'A2' }, { id: 'A3' }]));

// Socket.IO events relay
io.on('connection', (socket) => {
    ['ambulanceAssigned', 'ambulanceRequest', 'ambulanceAccepted', 'locationUpdate', 'signalModeChange', 'override', 'emergencyCompleted', 'notification']
        .forEach(evt => socket.on(evt, (data) => io.emit(evt, data)));
});

// REST: minimal stubs
app.get('/api/auth/users', (req, res) => {
    const users = JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8'));
    res.json(users);
});

app.post('/api/auth/create-driver', (req, res) => {
    const { username, password, ambulanceId } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'username/password required' });
    const users = JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8'));
    users.push({ role: 'driver', username, password, ambulanceId });
    fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
    return res.json({ ok: true });
});

app.post('/api/emergency/assign', (req, res) => {
    const payload = req.body;
    io.emit('ambulanceAssigned', payload);
    res.json({ ok: true });
});

app.post('/api/traffic/mode', async (req, res) => {
    const { mode } = req.body;
    io.emit('signalModeChange', { mode });
    try {
        await axios.post('http://localhost:5001/signal_control', { mode });
    } catch (e) { /* ignore in demo */ }
    res.json({ ok: true });
});

app.post('/api/traffic/override', async (req, res) => {
    const { junction, action } = req.body;
    io.emit('override', { junction, action });
    try {
        await axios.post('http://localhost:5001/signal_control', { override: { junction, action } });
    } catch (e) { /* ignore in demo */ }
    res.json({ ok: true });
});

app.get('/api/traffic/status', async (req, res) => {
    try {
        const r = await axios.get('http://localhost:5001/status');
        return res.json(r.data);
    } catch (e) {
        return res.json({ junctions: [] });
    }
});

app.post('/api/emergency/compare', async (req, res) => {
    // mock comparison result for charting
    return res.json({
        trips: [
            { trip: 'T1', mnl: 9, vac: 7 },
            { trip: 'T2', mnl: 12, vac: 8 },
            { trip: 'T3', mnl: 10, vac: 7 },
        ],
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(Backend running on : ${ PORT }));