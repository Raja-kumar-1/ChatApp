const socket = io();

const nameInput = document.getElementById('name');
const roomInput = document.getElementById('room');
const joinBtn = document.getElementById('join');
const leaveBtn = document.getElementById('leave');
const chat = document.getElementById('chat');
const roomLabel = document.getElementById('room-label');
const messages = document.getElementById('messages');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message');
const inviteUrlInput = document.getElementById('invite-url');
const copyUrlBtn = document.getElementById('copy-url');
const qrToggleBtn = document.getElementById('qr-toggle');
const qrWrap = document.getElementById('qr-wrap');
const qrImg = document.getElementById('qr-img');

let joined = false;
let currentRoom = '';
let currentName = '';

function updateInviteUrl(url) {
  inviteUrlInput.value = url;
}

function setQr(url) {
  const encoded = encodeURIComponent(url);
  qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encoded}`;
}

function addMessage({ name, text, ts, system = false }) {
  const div = document.createElement('div');
  div.className = system ? 'msg system' : 'msg';
  if (name === currentName && !system) div.classList.add('me');

  if (system) {
    div.textContent = text;
  } else {
    const meta = document.createElement('div');
    meta.className = 'meta';
    const time = new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    meta.textContent = `${name} • ${time}`;

    const body = document.createElement('div');
    body.textContent = text;

    div.append(meta, body);
  }

  messages.append(div);
  messages.scrollTop = messages.scrollHeight;
}

joinBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  const room = roomInput.value.trim();
  if (!name || !room) return alert('Enter your name and room code.');

  currentName = name;
  currentRoom = room;
  joined = true;
  roomLabel.textContent = `Room: ${room}`;
  chat.hidden = false;

  socket.emit('join', { room, name });
});

leaveBtn.addEventListener('click', () => {
  window.location.reload();
});

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!joined) return;
  const text = messageInput.value.trim();
  if (!text) return;
  socket.emit('message', { room: currentRoom, name: currentName, text });
  messageInput.value = '';
});

socket.on('message', (payload) => addMessage(payload));
socket.on('system', (text) => addMessage({ text, system: true }));

// Invite link + QR helpers
const initialUrl = window.location.href.replace(/\/$/, '');
updateInviteUrl(initialUrl);
setQr(initialUrl);

copyUrlBtn.addEventListener('click', async () => {
  const url = inviteUrlInput.value.trim();
  if (!url) return;
  try {
    await navigator.clipboard.writeText(url);
    copyUrlBtn.textContent = 'Copied!';
    setTimeout(() => (copyUrlBtn.textContent = 'Copy link'), 1500);
  } catch (err) {
    alert('Copy failed. You can copy the text manually.');
  }
});

qrToggleBtn.addEventListener('click', () => {
  qrWrap.hidden = !qrWrap.hidden;
  qrToggleBtn.textContent = qrWrap.hidden ? 'Show QR' : 'Hide QR';
  if (!qrWrap.hidden) {
    setQr(inviteUrlInput.value.trim() || initialUrl);
  }
});

inviteUrlInput.addEventListener('change', (e) => {
  const url = e.target.value.trim();
  if (url) setQr(url);
});
