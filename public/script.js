const socket = io();
const joinBtn = document.getElementById('join-btn');
const joinContainer = document.getElementById('join-container');
const chatContainer = document.getElementById('chat-container');
const roomName = document.getElementById('room-name');
const chatBox = document.getElementById('chat-box');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

let username = '';
let room = '';

joinBtn.addEventListener('click', () => {
  username = document.getElementById('username').value.trim();
  room = document.getElementById('room').value.trim();

  if (username && room) {
    socket.emit('joinRoom', { username, room });
    joinContainer.classList.add('hidden');
    chatContainer.classList.remove('hidden');
    roomName.textContent = `Room: ${room}`;
  }
});

messageForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('chatMessage', message);
    messageInput.value = '';
  }
});

socket.on('message', msg => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<strong>${msg.username}</strong> [${msg.time}]: ${msg.text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
});
