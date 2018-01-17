/* eslint-disable prefer-arrow-callback */

const expect = require('expect.js');
const { Bot, BotTextMessage, UserTextMessage } = require('botfuel-dialog');
const config = require('../test-config');

describe('GreetingsDialog', () => {
  it('should have the proper interaction when the bot not understand', async function () {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([
      new UserTextMessage('Hello bot!'),
      new UserTextMessage('What\'s the weather today ?'),
    ]);
    expect(bot.adapter.log).to.eql([
      new UserTextMessage('Hello bot!'),
      new BotTextMessage('Hello human!'),
      new UserTextMessage('What\'s the weather today ?'),
      new BotTextMessage('Not understood.'),
    ].map(msg => msg.toJson(userId)));
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user.conversations.length).to.be(1);
    expect(dialogs.stack).to.be.empty();
    expect(dialogs.previous.length).to.be(2);
    expect(dialogs.previous[0].name).to.be('greetings');
    expect(dialogs.previous[1].name).to.be('default');
  });

  it('should say something different when greeting for the second time', async function () {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([
      new UserTextMessage('Hello bot!'),
      new UserTextMessage('Hello bot!'),
    ]);
    expect(bot.adapter.log).to.eql([
      new UserTextMessage('Hello bot!'),
      new BotTextMessage('Hello human!'),
      new UserTextMessage('Hello bot!'),
      new BotTextMessage('Hello again human!'),
    ].map(msg => msg.toJson(userId)));
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user.conversations.length).to.be(1);
    expect(dialogs.stack).to.be.empty();
    expect(dialogs.previous.length).to.be(2);
    expect(dialogs.previous[0].name).to.be('greetings');
    expect(dialogs.previous[1].name).to.be('greetings');
  });
});
