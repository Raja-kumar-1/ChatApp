const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Simple health check for Render/uptime checks
app.get('/healthz', (_req, res) => {
  res.json({ ok: true });
});

// Fallback to index.html for root and unknown paths (static SPA-ish)
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
  socket.on('join', ({ room, name }) => {
    socket.data = { name, room };
    socket.join(room);
    socket.to(room).emit('system', `${name} joined the chat`);
  });

  socket.on('message', ({ room, name, text }) => {
    io.to(room).emit('message', { name, text, ts: Date.now() });
  });

  socket.on('disconnect', () => {
    const { name, room } = socket.data || {};
    if (room && name) {
      socket.to(room).emit('system', `${name} left the chat`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
