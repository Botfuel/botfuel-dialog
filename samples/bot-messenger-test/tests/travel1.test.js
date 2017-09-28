const expect = require('expect.js');
const sdk2 = require('@botfuel/bot-sdk2');
const config = require('../test_config');

const Messages = sdk2.Messages;

describe('TravelDialog (1)', () => {
  it('should have the proper interaction when the user gives the destination', async function () {
    const bot = new sdk2.Bot(config);
    const botId = config.id;
    const userId = bot.adapter.userId;
    await bot.play([
      Messages.userText(botId, userId, 'Je pars de Nantes'),
    ]);
    expect(bot.adapter.log).to.eql([
      Messages.userText(botId, userId, 'Je pars de Nantes'),
      Messages.botText(botId, userId, 'Tu pars de : Nantes.'),
      Messages.botText(botId, userId, 'Quand pars tu?'),
    ]);
    const user = await bot.brain.getUser(userId);
    expect(user.conversations.length).to.be(1);
    expect(user.dialogs.length).to.be(1);
    const lastConversation = await bot.brain.getLastConversation(userId);
    expect(lastConversation).to.have.property('travel');
    expect(lastConversation.travel).to.have.property('city');
  });

  it('should have the proper interaction when the user gives the destination then the date', async function () {
    const bot = new sdk2.Bot(config);
    const botId = config.id;
    const userId = bot.adapter.userId;
    await bot.play([
      Messages.userText(botId, userId, 'Je pars de Nantes'),
      Messages.userText(botId, userId, 'demain'),
    ]);
    expect(bot.adapter.log).to.eql([
      Messages.userText(botId, userId, 'Je pars de Nantes'),
      Messages.botText(botId, userId, 'Tu pars de : Nantes.'),
      Messages.botText(botId, userId, 'Quand pars tu?'),
      Messages.userText(botId, userId, 'demain'),
      Messages.botText(botId, userId, 'Tu pars : demain.'),
    ]);
    const user = await bot.brain.getUser(userId);
    expect(user.conversations.length).to.be(1);
    expect(user.dialogs.length).to.be(0);
    const lastConversation = await bot.brain.getLastConversation(userId);
    expect(lastConversation).to.have.property('travel');
    expect(lastConversation.travel).to.have.property('city');
    expect(lastConversation.travel).to.have.property('time');
  });
});
