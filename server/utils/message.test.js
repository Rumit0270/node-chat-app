var expect = require('expect');
var { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var message = generateMessage('rumit', 'hello');

    expect(message.from).toBe('rumit');
    expect(message.text).toBe('hello');
    expect(message.createdAt).toBeA('number');
  });

});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    var from = 'Admin';
    var latitude = 10;
    var longitude = 10;
    var url = `http://www.google.com/maps?q=${latitude},${longitude}`;

    var locationMessage = generateLocationMessage(from, latitude, longitude);
    expect(locationMessage.from).toBe(from);
    expect(locationMessage.createdAt).toBeA('number');
    expect(locationMessage.url ).toBe(url);
  });
});
