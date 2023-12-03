export const setupConnections = (io) => {
  io.on('connection', (socket) => {
    socket.emit('eventFromServer', 'Hello, World 👋');
  });
};