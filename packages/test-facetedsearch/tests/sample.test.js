const { Bot, BotTextMessage, UserTextMessage } = require('botfuel-dialog');
const config = require('../test-config');
// const Replay = require('replay');
describe('test bot scenario', () => {
  test('Bot return articles without asking unneccessary further question ', async () => {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([new UserTextMessage('I want to buy Levis jeans')]);
    expect(bot.adapter.log).toContainEqual(
      new BotTextMessage('Thank you. We have 2 products:').toJson(userId),
    );
  });
});
