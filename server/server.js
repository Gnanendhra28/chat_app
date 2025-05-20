const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const moment = require('moment');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, '../public')));

const users = {};

io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    socket.join(room);
    users[socket.id] = { username, room };

    socket.broadcast.to(room).emit('message', {
      username: 'System',
      text: `${username} has joined the chat`,
      time: moment().format('h:mm A')
    });
  });

  socket.on('chatMessage', msg => {
    const user = users[socket.id];
    if (user) {
      io.to(user.room).emit('message', {
        username: user.username,
        text: msg,
        time: moment().format('h:mm A')
      });
    }
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      io.to(user.room).emit('message', {
        username: 'System',
        text: `${user.username} has left the chat`,
        time: moment().format('h:mm A')
      });
      delete users[socket.id];
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
