// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const os = require('os');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Add endpoint to get server IP
app.get('/server-info', (req, res) => {
  const networkInterfaces = os.networkInterfaces();
  const localIP = Object.values(networkInterfaces)
    .flat()
    .find(details => details.family === 'IPv4' && !details.internal)?.address || 'localhost';
  
  res.json({ 
    serverIP: localIP,
    port: PORT 
  });
});

let selectedPrize = '';
const connectedClients = new Set();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  connectedClients.add(socket.id);

  socket.emit('prizeUpdate', selectedPrize);
  io.emit('clientsUpdate', connectedClients.size);

  socket.on('getPrizeState', () => {
    socket.emit('prizeUpdate', selectedPrize);
  });

  socket.on('selectPrize', (prize) => {
    selectedPrize = prize;
    io.emit('prizeUpdate', selectedPrize);
  });

  socket.on('disconnect', () => {
    connectedClients.delete(socket.id);
    io.emit('clientsUpdate', connectedClients.size);
  });
});

const PORT = 4000;
server.listen(PORT, '0.0.0.0', () => {
  const networkInterfaces = os.networkInterfaces();
  const localIP = Object.values(networkInterfaces)
    .flat()
    .find(details => details.family === 'IPv4' && !details.internal)?.address || 'localhost';

  console.log(`Server running on:`);
  console.log(`- Local: http://localhost:${PORT}`);
  console.log(`- Network: http://${localIP}:${PORT}`);
});