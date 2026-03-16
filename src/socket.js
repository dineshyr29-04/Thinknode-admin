import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
const socket = io(SOCKET_URL, { autoConnect: true });

export function on(event, cb) { socket.on(event, cb); return () => socket.off(event, cb); }
export function once(event, cb) { socket.once(event, cb); }
export function off(event, cb) { if (cb) socket.off(event, cb); else socket.removeAllListeners(event); }
export function emit(event, data) { socket.emit(event, data); }

export default socket;
