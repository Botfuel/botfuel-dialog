const expect = require('expect.js');
const sdk2 = require('@botfuel/bot-sdk2');
const config = require('../test_config');

const Messages = sdk2.Messages;

describe('NameDialog', () => {
  it('should have the proper interaction when the user gives its name', async function () {
    const bot = new sdk2.Bot(config);
    const botId = config.id;
    const userId = bot.adapter.userId;
    await bot.play([
      Messages.userText(botId, userId, 'Je m\'appelle Jean'),
    ]);
    expect(bot.adapter.log).to.eql([
      Messages.userText(botId, userId, 'Je m\'appelle Jean'),
      Messages.botText(botId, userId, 'Tu t\'appelles : Jean.'),
    ]);
    const user = await bot.brain.getUser(userId);
    expect(user.conversations.length).to.be(1);
    expect(user.dialogs.length).to.be(0);
    const lastConversation = await bot.brain.getLastConversation(userId);
    expect(lastConversation).to.have.property('name');
    expect(lastConversation.name).to.have.property('forename');
  });

  it('should ask for the forename', async function () {
    const bot = new sdk2.Bot(config);
    const botId = config.id;
    const userId = bot.adapter.userId;
    await bot.play([
      Messages.userText(botId, userId, 'Demande moi comment je m\'appelle'),
      Messages.userText(botId, userId, 'Je m\'appelle Jean'),
    ]);
    expect(bot.adapter.log).to.eql([
      Messages.userText(botId, userId, 'Demande moi comment je m\'appelle'),
      Messages.botText(botId, userId, 'Quel est ton prénom?'),
      Messages.userText(botId, userId, 'Je m\'appelle Jean'),
      Messages.botText(botId, userId, 'Tu t\'appelles : Jean.'),
    ]);
    const user = await bot.brain.getUser(userId);
    expect(user.conversations.length).to.be(1);
    expect(user.dialogs.length).to.be(0);
    const lastConversation = await bot.brain.getLastConversation(userId);
    expect(lastConversation).to.have.property('name');
    expect(lastConversation.name).to.have.property('forename');
  });
});
