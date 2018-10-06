const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const moment = require('moment');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');


var app = express();
app.use(express.static(publicPath));

var server = http.createServer(app);

var io = socketIO(server);
var users = new Users();
var activeRooms = [];

io.on('connection', (socket) => {
  console.log('Socket Connected');

  socket.on('getActiveRooms', (params, callback) => {
    callback(activeRooms);
  });

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Invalid Name or room name');
    }

    // check if user with same name exists
    var usernames = users.getUserList(params.room).map((username) => username.toLowerCase());
    usernames.forEach((username) => {
      if (username === params.name.toLowerCase()) {
        return callback('User with the same display name already exists in the room. Try another username.');
      }
    });

    if(!activeRooms.includes(params.room.toLowerCase())) {
      activeRooms.push(params.room.toLowerCase())
    }

    socket.join(params.room); //socket.leave()
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat room'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined the room.`));
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);
    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }

  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');

    var user = users.removeUser(socket.id);

    if (user) {
      //remove room from active room array if no user is assosciatec to that room
      if (user.room && users.getNumberOfUsers(user.room) === 0) {
        activeRooms = activeRooms.filter((room) => room !== user.room);
      }
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room.`));
    }
  });

});


server.listen(port, () => {
  console.log(`server is up at port ${port}`);
});
