const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, '../frontend')));

let clients = [];

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    // 받은 메시지를 그대로 브로드캐스트
    let parsed;
    try {
      parsed = JSON.parse(message);
    } catch {
      console.log("Invalid JSON:", message);
      return;
    }

    const broadcastData = JSON.stringify({
      nickname: parsed.nickname || 'Anonymous',
      message: parsed.message || ''
    });

    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(broadcastData);
      }
    });
  });

  clients.push(ws);

  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
