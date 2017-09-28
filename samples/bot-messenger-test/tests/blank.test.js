const expect = require('expect.js');
const sdk2 = require('@botfuel/bot-sdk2');
const config = require('../test_config');

const Messages = sdk2.Messages;

it('should handle blank input when no previous dialog', async function () {
  const bot = new sdk2.Bot(config);
  const botId = config.id;
  const userId = bot.adapter.userId;
  await bot.play([
    Messages.userText(botId, userId, ''),
  ]);
  expect(bot.adapter.log).to.eql([
    Messages.userText(botId, userId, ''),
    Messages.botText(botId, userId, 'Not understood.'),
  ]);
  const user = await bot.brain.getUser(userId);
  expect(user.botId).to.be(botId);
  expect(user.userId).to.be(userId);
  expect(user.conversations.length).to.be(1);
  expect(user.dialogs).to.be.empty();
  expect(user.lastDialog.label).to.be('default_dialog');
});

it('should handle blank input when previous dialog is not understood', async function () {
  const bot = new sdk2.Bot(config);
  const botId = config.id;
  const userId = bot.adapter.userId;
  await bot.play([
    Messages.userText(botId, userId, ''),
    Messages.userText(botId, userId, ''),
  ]);
  expect(bot.adapter.log).to.eql([
    Messages.userText(botId, userId, ''),
    Messages.botText(botId, userId, 'Not understood.'),
    Messages.userText(botId, userId, ''),
    Messages.botText(botId, userId, 'Not understood.'),
  ]);
  const user = await bot.brain.getUser(userId);
  expect(user.botId).to.be(botId);
  expect(user.userId).to.be(userId);
  expect(user.conversations.length).to.be(1);
  expect(user.dialogs).to.be.empty();
  expect(user.lastDialog.label).to.be('default_dialog');
});
