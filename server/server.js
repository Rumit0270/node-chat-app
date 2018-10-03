const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {
  console.log('New User Connected');

  socket.emit('newMessage', {
    from: 'admin',
    text: 'Welcome to chat app',
    createdAt: new Date().getTime()
  });

  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'New user joined',
    createdAt: new Date().getTime()
  });

  socket.on('createMessage', (message) => {
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });

    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.test,
    //   createdAt: new Date().getTime()
    // });

    socket.on('disconnect', () => {
      console.log('Client disconnected');

    });
  });
});

app.use(express.static(publicPath));

server.listen(port, () => {
  console.log(`server is up at port ${port}`);
});
