var socket = io();

socket.emit('getActiveRooms', undefined, function(activeRooms) {
  console.log(activeRooms);

  if(activeRooms.length <= 0) {
    $('#selectActiveRoom').html('');
  } else {
    var select = $('<select></select>');
    select.attr('name', 'rooms');

    // show default text for dropdown
    var option = $('<option></option>');
    option.text('Choose here');
    option.attr('selected', 'selected');
    option.attr('disabled', 'disabled');
    option.attr('hidden', 'hidden');

    select.append(option);

    // actual options
    activeRooms.forEach((room) => {
      var option = $(`<option>${room}</option>`);
      option.attr('value', room);
      select.append(option);
    });
    $('#selectActiveRoom').append(select);
  }
});

$('#selectActiveRoom').change(function() {
  var selectedRoom = $('#selectActiveRoom :selected').text();
  $('#chatRoomInput').val(selectedRoom);
});
