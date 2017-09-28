const expect = require('expect.js');
const sdk2 = require('@botfuel/bot-sdk2');
const config = require('../test_config');

/*

describe('TravelDialog (3)', () => {
  it('should chain a prompt and confirmation dialog', async function () {
    const bot = new sdk2.Bot(config);
    await bot.play([
      { type: 'text', payload: 'Je pars de Nantes' },
      { type: 'text', payload: 'Demain' },
      { type: 'text', payload: 'Oui' },
    ]);
    expect(bot.adapter.log).to.eql([
      {
        type: 'text',
        payload: 'Je pars de Nantes',
        userId: 'USER_TEST',
        botId: 'TEST_BOT',
        origin: 'user',
      },
      {
        type: 'text',
        payload: 'Tu pars de : nantes.',
        userId: 'USER_TEST',
        botId: 'TEST_BOT',
        origin: 'bot',
      },
      {
        type: 'text',
        payload: 'Quand pars tu?',
        userId: 'USER_TEST',
        botId: 'TEST_BOT',
        origin: 'bot',
      },
      {
        type: 'text',
        payload: 'Demain',
        userId: 'USER_TEST',
        botId: 'TEST_BOT',
        origin: 'user',
      },
      {
        type: 'text',
        payload: 'Tu pars donc de Nantes demain, peux tu me confirmer?',
        userId: 'USER_TEST',
        botId: 'TEST_BOT',
        origin: 'bot',
      },
      {
        type: 'text',
        payload: 'Oui',
        userId: 'USER_TEST',
        botId: 'TEST_BOT',
        origin: 'user',
      },
      {
        type: 'text',
        payload: 'Merci. Je vais voir quels sont les trajets disponibles',
        userId: 'USER_TEST',
        botId: 'TEST_BOT',
        origin: 'bot',
      },
    ]);
    const user = await bot.brain.getUser(bot.adapter.userId);
    expect(user.conversations.length).to.be(1);
    expect(user.dialogs).to.be.empty();
    const lastConversation = await bot.brain.getLastConversation(bot.adapter.userId);
    expect(lastConversation).to.have.property('travel');
    expect(lastConversation.travel).to.have.property('city');
    expect(lastConversation.travel).to.have.property('time');
    expect(lastConversation.travel.city.body).to.be('montreuil');
    expect(lastConversation.travel.time.body).to.be('demain');
  });
});

*/
