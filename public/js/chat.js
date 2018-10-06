var socket = io();

function generateColor() {
  var colors = ['red', 'blue', 'yellow', 'green', 'purple', 'chocolate', 'gold', 'indigo', 'olive', 'plum', 'tomato'];
  var min = 0;
  var max = colors.length;
  var random =Math.floor(Math.random() * (+max - +min)) + +min;
  return colors[random];
}

function scrollToBottom() {
  //selectors
  var messages =  $('#messages');
  var newMessage = messages.children('li:last-child');

  //heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop =  messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function() {
  console.log('Connected to server');
  var params = $.deparam(window.location.search);
  // make room case insensitive
  params.room = params.room.toLowerCase();
  socket.emit('join', params, function(error) {
    if (error) {
      alert(error);
      window.location.href = '/';
    } else {
      console.log('no error');
    }
  });
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('newMessage', function(newMessage) {
  var formattedTime = moment(newMessage.createdAt).format('h:mm a');

  var template = $('#message-template').html();
  var html = Mustache.render(template, {
    from: newMessage.from,
    text: newMessage.text,
    createdAt: formattedTime,
    color: generateColor()
  });
  $('#messages').append(html);
  scrollToBottom();

  // var li = $('<li></li>');
  // li.text(`${newMessage.from} ${formattedTime}: ${newMessage.text}`);
  //
  // $('#messages').append(li);
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
  var formattedTime = moment(message.createdAt).format('h:mm a');

  var template = $('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });
  $('#messages').append(html);
  scrollToBottom();
  // var li = $('<li></li>');
  // var a = $('<a target="_blank">My current Location</a>');
  //
  // li.text(`${message.from} ${formattedTime}: `);
  // a.attr('href', message.url);
  // li.append(a);
  //
  // $('#messages').append(li);
});


socket.on('updateUserList', function(users) {
  var ol = $('<ol></ol>')
  users.forEach(function(user) {
    ol.append($('<li></li>').append(user));
  });

  $('#users').html(ol);
});
