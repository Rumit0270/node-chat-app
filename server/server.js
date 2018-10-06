const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const moment = require('moment');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const {isRealString} = require('./utils/validation');
const { Users } = require('./utils/users');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');


var app = express();
app.use(express.static(publicPath));

var server = http.createServer(app);

var io = socketIO(server);
var users = new Users();

io.on('connection', (socket) => {
  console.log('New User Connected');

  socket.on('join', (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Invalid Name or room name');
    }
    socket.join(params.room);//socket.leave()
      users.removeUser(socket.id);
      users.addUser(socket.id, params.name, params.room);

      io.to(params.room).emit('updateUserList', users.getUserList(params.room));
      socket.emit('newMessage',  generateMessage('Admin', 'Welcome to the Chat room'));
      socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined the room.`));
      callback();
  });

  socket.on('createMessage', (message, callback) => {
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    var user = users.removeUser(socket.id);
    if(user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room.`));
    }
  });

});


server.listen(port, () => {
  console.log(`server is up at port ${port}`);
});
