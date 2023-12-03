import type { Server } from 'socket.io';

export const setupConnections = (io: Server) => {
  io.on('connection', (socket) => {
    socket.emit('eventFromServer', 'Hello, World 👋');
  });
};