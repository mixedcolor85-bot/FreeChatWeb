const nickname = localStorage.getItem('nickname') || 'Anonymous';
const ws = new WebSocket(`ws://${window.location.host}`);
const messagesDiv = document.getElementById('messages');
const input = document.getElementById('messageInput');

ws.onopen = () => console.log('WebSocket connected');
ws.onerror = (err) => console.log('WebSocket error:', err);

ws.onmessage = (event) => {
  let data;
  try {
    data = JSON.parse(event.data);
  } catch {
    console.log('Invalid message:', event.data);
    return;
  }

  const msgEl = document.createElement('div');
  msgEl.classList.add('message'); // 클래스 추가
  msgEl.textContent = `${data.nickname}: ${data.message}`;
  messagesDiv.appendChild(msgEl);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
};

function sendMessage() {
  const message = input.value.trim();
  if (!message) return;
  ws.send(JSON.stringify({ nickname, message }));
  input.value = '';
  input.focus();
}
