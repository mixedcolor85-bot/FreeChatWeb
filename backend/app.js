const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 프론트엔드 정적 파일 제공
app.use(express.static(path.join(__dirname, '../frontend')));

let clients = [];

wss.on('connection', (ws) => {
  console.log('New client connected');
  clients.push(ws);

  ws.on('message', (message) => {
    let data;
    try {
      data = JSON.parse(message); // 클라이언트가 JSON.stringify로 보냈다고 가정
    } catch (e) {
      console.error('Invalid message format:', message);
      return;
    }

    // 모든 클라이언트에게 브로드캐스트
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });

  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
