var socket = io();

socket.on('connect', function() {
  console.log('Connected to server');

  // socket.emit('createMessage', {
  //   from: 'lima@example.com',
  //   text: 'Hi, how are you?',
  // });
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('newMessage', function(newMessage) {
  console.log(newMessage);
  var li = $('<li></li>');
  li.text(`${newMessage.from}: ${newMessage.text}`);

  $('#messages').append(li);
});

// socket.emit('createMessage', {
//   from: 'Johny',
//   text: 'Hi'
// }, function (data) {
//   console.log('Acknowledgement received.', data);
// });
//

$('#message-form').on('submit', function(e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: $('[name=message]').val()
  }, function() {
    console.log();
  });
});
