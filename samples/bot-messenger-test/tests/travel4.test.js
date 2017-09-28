const expect = require('expect.js');
const sdk2 = require('@botfuel/bot-sdk2');
const config = require('../test_config');

/*

describe('TravelDialog (4)', () => {
  it('should handle short yes/no answers', async function () {
    const bot = new sdk2.Bot(config);
    await bot.play([
      { type: 'text', payload: 'Je pars de Nantes' },
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
        payload: 'Est-ce que tu voyages seul?',
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
        payload: 'Tu voyages seul: true',
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

    ]);
    const user = await bot.brain.getUser(bot.adapter.userId);
    expect(user.conversations.length).to.be(1);
    expect(user.dialogs).to.be.empty();
    const lastConversation = await bot.brain.getLastConversation(bot.adapter.userId);
    expect(lastConversation).to.have.property('travel');
    expect(lastConversation.travel).to.have.property('city');
    expect(lastConversation.travel).to.have.property('singleTraveller');
    expect(lastConversation.travel.city.body).to.be('montreuil');
    expect(lastConversation.travel.singleTraveller.body).to.be(true);
  });
});

*/
