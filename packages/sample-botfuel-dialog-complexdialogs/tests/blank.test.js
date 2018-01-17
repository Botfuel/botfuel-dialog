/* eslint-disable prefer-arrow-callback */

const expect = require('expect.js');
const { Bot, BotTextMessage, UserTextMessage } = require('botfuel-dialog');
const config = require('../test-config');

describe('Blank', function () {
  it('should handle blank input when no previous dialog', async function () {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([
      new UserTextMessage(''),
    ]);
    expect(bot.adapter.log).to.eql([
      new UserTextMessage(''),
      new BotTextMessage('Not understood.'),
    ].map(msg => msg.toJson(userId)));
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user.userId).to.be(userId);
    expect(user.conversations.length).to.be(1);
    expect(dialogs.stack).to.be.empty();
    expect(dialogs.previous.length).to.be(1);
    expect(dialogs.previous[0].name).to.be('default');
  });

  it('should handle blank input when previous dialog is not understood', async function () {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([
      new UserTextMessage(''),
      new UserTextMessage(''),
    ]);
    expect(bot.adapter.log).to.eql([
      new UserTextMessage(''),
      new BotTextMessage('Not understood.'),
      new UserTextMessage(''),
      new BotTextMessage('Not understood.'),
    ].map(msg => msg.toJson(userId)));
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user.userId).to.be(userId);
    expect(user.conversations.length).to.be(1);
    expect(dialogs.stack).to.be.empty();
    expect(dialogs.previous.length).to.be(2);
    expect(dialogs.previous[0].name).to.be('default');
    expect(dialogs.previous[1].name).to.be('default');
  });
});
