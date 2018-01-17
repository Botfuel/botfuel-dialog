/* eslint-disable prefer-arrow-callback */

const expect = require('expect.js');
const { Bot, BotTextMessage, UserTextMessage } = require('botfuel-dialog');
const config = require('../test-config');

describe('Chaining', function () {
  it('should call a second dialog', async function () {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([new UserTextMessage('I want to buy a blue automatic car.')]);
    expect(bot.adapter.log).to.eql(
      [
        new UserTextMessage('I want to buy a blue automatic car.'),
        new BotTextMessage('Entities defined: color, transmission'),
        new BotTextMessage("You're welcome!"),
      ].map(msg => msg.toJson(userId)),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user.userId).to.be(userId);
    expect(user.conversations.length).to.be(1);
    expect(dialogs.stack).to.be.empty();
    expect(dialogs.previous.length).to.be(2);
    expect(dialogs.previous[0].name).to.be('car');
    expect(dialogs.previous[1].name).to.be('thanks');
  });
});
