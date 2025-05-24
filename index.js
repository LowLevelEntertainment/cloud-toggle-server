const WebSocket = require('ws');
const PORT = process.env.PORT || 3000;
const server = new WebSocket.Server({ port: PORT });

let isOnline = true;

server.on('connection', socket => {
  if (!isOnline) {
    socket.close(1013, 'Server is offline');
    return;
  }

  socket.on('message', message => {
    server.clients.forEach(client => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

console.log(`Server running on port ${PORT}`);

process.stdin.on('data', data => {
  const input = data.toString().trim().toLowerCase();
  if (input === 'offline') {
    isOnline = false;
    console.log('Server toggled OFFLINE');
  } else if (input === 'online') {
    isOnline = true;
    console.log('Server toggled ONLINE');
  } else {
    console.log('Type "online" or "offline" to toggle server');
  }
});
