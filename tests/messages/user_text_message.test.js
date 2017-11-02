/* eslint-disable prefer-arrow-callback */

const expect = require('expect.js');
const { UserTextMessage } = require('../../src/messages');

describe('UserTextMessage', function () {
  it('should generate the proper json', async function () {
    const message = new UserTextMessage('foo');
    expect(message.toJson()).to.eql({
      type: 'text',
      sender: 'user',
      payload: {
        value: 'foo',
      },
    });
  });
});
