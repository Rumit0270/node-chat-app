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

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  // socket.emit('newMessage', {
  //   from: 'julie@example.com',
  //   text: 'Hello!!',
  //   createdAt: 456
  // });

  socket.on('createMessage', (message) => {
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
  });
});

app.use(express.static(publicPath));

server.listen(port, () => {
  console.log(`server is up at port ${port}`);
});
