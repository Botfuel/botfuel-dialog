/* eslint-disable prefer-arrow-callback */

const expect = require('expect.js');
const { BotTextMessage } = require('../../src/messages');

describe('BotTextMessage', function () {
  it('should generate the proper json', async function () {
    const message = new BotTextMessage('foo');
    expect(message.toJson()).to.eql({
      type: 'text',
      sender: 'bot',
      payload: {
        value: 'foo',
      },
    });
  });
});
