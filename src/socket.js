import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Get token from localStorage
const getToken = () => {
  try {
    const session = localStorage.getItem('tn_activeSession');
    return session ? JSON.parse(session).token : null;
  } catch {
    return null;
  }
};

const token = getToken();

const socket = io(SOCKET_URL, {
  autoConnect: true,
  auth: {
    token: token || '',
  },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});

// Update token when it changes (after login)
export const updateSocketAuth = (newToken) => {
  socket.auth.token = newToken;
  socket.connect();
};

export function on(event, cb) {
  socket.on(event, cb);
  return () => socket.off(event, cb);
}

export function once(event, cb) {
  socket.once(event, cb);
}

export function off(event, cb) {
  if (cb) socket.off(event, cb);
  else socket.removeAllListeners(event);
}

export function emit(event, data) {
  socket.emit(event, data);
}

export function disconnect() {
  socket.disconnect();
}

export function reconnect() {
  socket.connect();
}

export default socket;
