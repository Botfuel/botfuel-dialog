const expect = require('expect.js');
const { Bot, BotTextMessage, UserTextMessage } = require('botfuel-dialog');
const config = require('../test-config');

describe('GuessDialog', () => {
  it('should keep prompting until it has the right answer', async () => {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([
      new UserTextMessage('Your favorite color is blue'),
      new UserTextMessage('Your favorite color is red'),
      new UserTextMessage('Your favorite color is green'),
    ]);
    expect(bot.adapter.log).to.eql(
      [
        new UserTextMessage('Your favorite color is blue'),
        new BotTextMessage('Nope! Guess again.'),
        new UserTextMessage('Your favorite color is red'),
        new BotTextMessage('Congratulations! My favorite color is red.'),
        new UserTextMessage('Your favorite color is green'),
        new BotTextMessage('Nope! Guess again.'),
      ].map(msg => msg.toJson(userId)),
    );

    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user.conversations.length).to.be(1);
    expect(dialogs.stack).not.to.be.empty();
    const lastConversation = await bot.brain.getLastConversation(userId);
    expect(lastConversation).to.have.property('guess');
    expect(lastConversation.guess).to.have.property('favoriteColor');
    expect(lastConversation.guess.favoriteColor.values[0]).to.have.property('name', 'green');
  });
});
