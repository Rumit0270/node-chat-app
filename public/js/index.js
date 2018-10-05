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

var locationButton = $('#send-location');
locationButton.click(function() {
  if(!navigator.geolocation) {
      return alert('Geolocation not supported by your browser');
  }

  navigator.geolocation.getCurrentPosition((postion) => {
    console.log(postion);
    socket.emit('createLocationMessage', {
      latitude: postion.coords.latitude,
      longitude: postion.coords.longitude
    });
  }, (error) => {
    alert('Unable to fetch location.');
  });
});

socket.on('newLocationMessage', function(message) {
  var li = $('<li></li>');
  var a = $('<a target="_blank">My current Location</a>');

  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);

  $('#messages').append(li);
});
