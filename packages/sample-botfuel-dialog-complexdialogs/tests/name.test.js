/* eslint-disable prefer-arrow-callback */

const expect = require('expect.js');
const { Bot, BotTextMessage, UserTextMessage } = require('botfuel-dialog');
const config = require('../test-config');

describe('NameDialog', () => {
  it('should have the proper interaction when the user gives its name', async function () {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([
      new UserTextMessage('My name is John'),
    ]);
    expect(bot.adapter.log).to.eql([
      new UserTextMessage('My name is John'),
      new BotTextMessage('Entities defined: name'),
    ].map(msg => msg.toJson(userId)));
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    const lastConversation = await bot.brain.getLastConversation(userId);
    expect(user.conversations.length).to.be(1);
    expect(dialogs.stack).to.be.empty();
    expect(lastConversation).to.have.property('name');
    expect(lastConversation.name).to.have.property('name');
    expect(lastConversation.name.name.body).to.be('John');
  });

  it('should ask for the forename', async function () {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([
      new UserTextMessage('Ask me my name'),
      new UserTextMessage('My name is John'),
    ]);
    expect(bot.adapter.log).to.eql([
      new UserTextMessage('Ask me my name'),
      new BotTextMessage('Entities defined: '),
      new BotTextMessage('Entities needed: name'),
      new BotTextMessage('Which name?'),
      new UserTextMessage('My name is John'),
      new BotTextMessage('Entities defined: name'),
    ].map(msg => msg.toJson(userId)));
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    const lastConversation = await bot.brain.getLastConversation(userId);
    expect(user.conversations.length).to.be(1);
    expect(dialogs.stack).to.be.empty();
    expect(lastConversation).to.have.property('name');
    expect(lastConversation.name).to.have.property('name');
    expect(lastConversation.name.name.body).to.be('John');
  });
});
