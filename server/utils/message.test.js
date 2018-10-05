var expect = require('expect');
var { generateMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var message = generateMessage('rumit', 'hello');

    expect(message.from).toBe('rumit');
    expect(message.text).toBe('hello');
    expect(message.createdAt).toBeA('number');
  });
});
