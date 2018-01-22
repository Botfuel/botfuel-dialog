/* eslint prefer-arrow-callback: "off" */
const sinon = require('sinon');
const expect = require('expect.js');
const { Bot, BotTextMessage, UserTextMessage } = require('botfuel-dialog');
const config = require('../test-config');

const REFERENCE_INSTANT = new Date(2018, 0, 7, 15, 24, 13, 254);

describe('Delivery date', () => {
  it('should give expected delivery date', async function () {
    const clock = sinon.useFakeTimers(REFERENCE_INSTANT);
    const bot = new Bot(config);
    const userId = bot.adapter.userId;


    await bot.play([new UserTextMessage('What is the expected delivery date?')]);


    expect(bot.adapter.log).to.eql(
      [
        new UserTextMessage('What is the expected delivery date?'),
        new BotTextMessage('If you purchase today before 10pm, you purchase will be delivered by 2018-01-12.'),
      ].map(msg =>
        msg.toJson(userId),
      ),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user.userId).to.be(userId);
    expect(user.conversations.length).to.be(1);
    expect(dialogs.stack).to.be.empty();
    expect(dialogs.previous.length).to.be(1);
    expect(dialogs.previous[0].name).to.be('delivery-date');

    clock.restore();
  });
});
