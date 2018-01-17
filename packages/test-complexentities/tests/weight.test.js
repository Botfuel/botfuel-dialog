const expect = require('expect.js');
const { Bot, BotTextMessage, UserTextMessage } = require('botfuel-dialog');
const config = require('../test-config');

describe('WeightDialog', () => {
  it('should replace the highest priority entity when all are fulfilled', async () => {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([
      new UserTextMessage('I weight 77kg'),
      new UserTextMessage('88kg'),
      new UserTextMessage('99kg'),
      new UserTextMessage('I weight 7kg'),
    ]);
    expect(bot.adapter.log).to.eql(
      [
        new UserTextMessage('I weight 77kg'),
        new BotTextMessage('Cool, so you weigh 77'),
        new BotTextMessage('What about your male genitor?'),
        new UserTextMessage('88kg'),
        new BotTextMessage('Cool, so you weigh 77'),
        new BotTextMessage('Cool, so your male genitor weighs 88'),
        new BotTextMessage('What about your female genitor?'),
        new UserTextMessage('99kg'),
        new BotTextMessage('Cool, so you weigh 77'),
        new BotTextMessage('Cool, so your male genitor weighs 88'),
        new BotTextMessage('Cool, so your female genitor weighs 99'),
        new BotTextMessage('Your family is pretty heavy...'),
        new BotTextMessage('Your female genitor especially!'),
        new UserTextMessage('I weight 7kg'),
        new BotTextMessage('Cool, so you weigh 7'),
        new BotTextMessage('Cool, so your male genitor weighs 88'),
        new BotTextMessage('Cool, so your female genitor weighs 99'),
        new BotTextMessage('Your family is pretty average.'),
      ].map(msg => msg.toJson(userId)),
    );
  });
});
