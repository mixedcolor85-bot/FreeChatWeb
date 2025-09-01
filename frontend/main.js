// 닉네임 확인 및 초기화
const nickname = localStorage.getItem('nickname');
if (!nickname) {
    window.location.href = 'index.html';
}

// 채팅방 상단에 닉네임 표시
document.getElementById('nicknameDisplay').textContent = nickname;

// WebSocket 연결
const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const ws = new WebSocket(`${protocol}://${window.location.host}`);

// DOM 요소
const messagesDiv = document.getElementById('messages');
const input = document.getElementById('messageInput');

// WebSocket 이벤트
ws.onopen = () => console.log('WebSocket connected');
ws.onerror = (err) => console.error('WebSocket error:', err);

ws.onmessage = (event) => {
    let data;
    try {
        data = JSON.parse(event.data);
    } catch (e) {
        console.error('Invalid message format:', event.data);
        return;
    }

    // 메시지 화면에 추가
    const msgEl = document.createElement('div');
    msgEl.classList.add('message');
    msgEl.textContent = `${data.nickname}: ${data.message}`;
    messagesDiv.appendChild(msgEl);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
};

// 메시지 전송 함수
function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ nickname, message }));
    } else {
        console.error('WebSocket is not open.');
    }

    input.value = '';
    input.focus();
}

// 엔터 키 전송
input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
        e.preventDefault();
    }
});

// 로그아웃
function logout() {
    if (ws.readyState === WebSocket.OPEN) {
        ws.close();
    }
    localStorage.removeItem('nickname');
    window.location.href = 'index.html';
}
