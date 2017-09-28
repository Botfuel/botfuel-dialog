const expect = require('expect.js');
const sdk2 = require('@botfuel/bot-sdk2');
const config = require('../test_config');

const Messages = sdk2.Messages;

describe('Disgressions', () => {
  it('should handle digressions', async function () {
    const bot = new sdk2.Bot(config);
    const botId = config.id;
    const userId = bot.adapter.userId;
    await bot.play([
      Messages.userText(botId, userId, 'Je pars de Nantes'),
      Messages.userText(botId, userId, 'Bonjour comment ça va ?'),
      Messages.userText(botId, userId, 'demain'),
    ]);
    expect(bot.adapter.log).to.eql([
      Messages.userText(botId, userId, 'Je pars de Nantes'),
      Messages.botText(botId, userId, 'Tu pars de : Nantes.'),
      Messages.botText(botId, userId, 'Quand pars tu?'),
      Messages.userText(botId, userId, 'Bonjour comment ça va ?'),
      Messages.botText(botId, userId, 'Bonjour humain!'),
      Messages.botText(botId, userId, 'Quand pars tu?'),
      Messages.userText(botId, userId, 'demain'),
      Messages.botText(botId, userId, 'Tu pars : demain.'),
    ]);
    const user = await bot.brain.getUser(userId);
    expect(user.conversations.length).to.be(1);
    expect(user.dialogs).to.be.empty();
    const lastConversation = await bot.brain.getLastConversation(userId);
    expect(lastConversation).to.have.property('travel');
    expect(lastConversation.travel).to.have.property('city');
    expect(lastConversation.travel).to.have.property('time');
    expect(lastConversation.travel.city.body).to.be('Nantes');
    expect(lastConversation.travel.time.body).to.be('demain');
  });
});
