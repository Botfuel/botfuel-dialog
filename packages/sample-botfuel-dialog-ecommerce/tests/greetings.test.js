/* eslint prefer-arrow-callback: "off" */

const expect = require('expect.js');
const { Bot, BotTextMessage, UserTextMessage } = require('botfuel-dialog');
const config = require('../test-config');

describe('Greetings', function () {
  it('should respond to Hello', async function () {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([new UserTextMessage('Hello')]);
    expect(bot.adapter.log).to.eql(
      [new UserTextMessage('Hello'), new BotTextMessage('Hello human!')].map(msg =>
        msg.toJson(userId),
      ),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user.userId).to.be(userId);
    expect(user.conversations.length).to.be(1);
    expect(dialogs.stack).to.be.empty();
    expect(dialogs.previous.length).to.be(1);
    expect(dialogs.previous[0].name).to.be('greetings');
  });
});
