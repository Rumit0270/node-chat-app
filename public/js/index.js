var socket = io();

socket.on('connect', function() {
  console.log('Connected to server');

  socket.emit('createMessage', {
    from: 'lima@example.com',
    text: 'Hi, how are you?',
  });
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});


socket.on('newMessage', function(newMessage) {
  console.log(newMessage);
});
