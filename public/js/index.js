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

  var messageText = $("[name=message]");
  socket.emit('createMessage', {
    from: 'User',
    text: messageText.val()
  }, function() {
    messageText.val('');
  });
});

var locationButton = $('#send-location');
locationButton.click(function() {
  if(!navigator.geolocation) {
      return alert('Geolocation not supported by your browser');
  }

  locationButton.attr("disabled", "disabled").text('Sending location...');


  navigator.geolocation.getCurrentPosition((postion) => {
    console.log(postion);
    locationButton.removeAttr("disabled").text('Send location');
    socket.emit('createLocationMessage', {
      latitude: postion.coords.latitude,
      longitude: postion.coords.longitude
    });
  }, (error) => {
    alert('Unable to fetch location.');
    locationButton.removeAttr("disabled").text('Send location');
  });
  //locationButton.removeAttr("disabled");

});

socket.on('newLocationMessage', function(message) {
  var li = $('<li></li>');
  var a = $('<a target="_blank">My current Location</a>');

  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);

  $('#messages').append(li);
});
