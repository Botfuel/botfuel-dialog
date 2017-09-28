const expect = require('expect.js');
const sdk2 = require('@botfuel/bot-sdk2');
const config = require('../test_config');

const Messages = sdk2.Messages;

describe('Multiple intents', () => {
  it('should understand mulitple intents in the same sentence', async function () {
    const bot = new sdk2.Bot(config);
    const botId = config.id;
    const userId = bot.adapter.userId;
    await bot.play([
      Messages.userText(botId, userId, 'Bonjour bot. Je pars de Nantes'),
    ]);
    expect(bot.adapter.log).to.eql([
      Messages.userText(botId, userId, 'Bonjour bot. Je pars de Nantes'),
      Messages.botText(botId, userId, 'Bonjour humain!'),
      Messages.botText(botId, userId, 'Tu pars de : Nantes.'),
      Messages.botText(botId, userId, 'Quand pars tu?'),
    ]);
  });
});
