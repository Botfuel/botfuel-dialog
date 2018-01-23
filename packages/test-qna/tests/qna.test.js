/* eslint prefer-arrow-callback: "off" */
const expect = require('expect.js');
const {
  Bot,
  ActionsMessage,
  BotTextMessage,
  Postback,
  UserTextMessage,
} = require('botfuel-dialog');
const config = require('../test-config');

describe('Qna', () => {
  it('should respond when not understood', async function () {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([new UserTextMessage('Where is bryan ?')]);
    expect(bot.adapter.log).to.eql(
      [
        new UserTextMessage('Where is bryan ?'),
        new BotTextMessage('I’m sorry, I did not understand your question. Please reach us at contact@my-sample-compagny.com for further assistance.'),
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
    expect(dialogs.previous[0].name).to.be('default');
  });

  it('should respond with many qnas when question not fully understood', async function () {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([new UserTextMessage('How can I purchase?')]);
    expect(bot.adapter.log).to.eql(
      [
        new UserTextMessage('How can I purchase?'),
        new BotTextMessage('What do you mean?'),
        new ActionsMessage([
          new Postback('What are your accepted payment options?', 'qnas', [
            {
              dim: 'qnas',
              value: [{ answer: 'You can pay for your purchase with Visa, Mastercard or using a PayPal account.' }],
            },
          ]),
          new Postback('I need assistance.', 'qnas', [
            {
              dim: 'qnas',
              value: [{ answer: 'Please reach us at contact@my-sample-compagny.com for further assistance.' }],
            },
          ]),
        ]),
      ].map(msg => msg.toJson(userId)),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user.userId).to.be(userId);
    expect(user.conversations.length).to.be(1);
    expect(dialogs.stack.length).to.be(1);
    expect(dialogs.stack[0].name).to.be('qnas');
    expect(dialogs.previous).to.be.empty();
  });

  it('should respond to hello', async function () {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([new UserTextMessage('Hello')]);
    expect(bot.adapter.log).to.eql(
      [
        new UserTextMessage('Hello'),
        new BotTextMessage('Hello! I can provide you with information about our payment and shipping policies.'),
      ].map(msg =>
        msg.toJson(userId),
      ),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user.userId).to.be(userId);
    expect(user.conversations.length).to.be(1);
    expect(dialogs.stack.length).to.be(0);
    expect(dialogs.previous.length).to.be(1);
    expect(dialogs.previous[0].name).to.be('qnas');
  });

  it('should respond to invoice question', async function () {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([new UserTextMessage('Could you send me an invoice please?')]);
    expect(bot.adapter.log).to.eql(
      [
        new UserTextMessage('Could you send me an invoice please?'),
        new BotTextMessage('The invoice for your purchase will be sent along with your goods. You can also download an electronic version from your account.'),
      ].map(msg =>
        msg.toJson(userId),
      ),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user.userId).to.be(userId);
    expect(user.conversations.length).to.be(1);
    expect(dialogs.stack.length).to.be(0);
    expect(dialogs.previous.length).to.be(1);
    expect(dialogs.previous[0].name).to.be('qnas');
  });

  it('should respond to assistance need', async function () {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([new UserTextMessage('A have a problem on the website.')]);
    expect(bot.adapter.log).to.eql(
      [
        new UserTextMessage('A have a problem on the website.'),
        new BotTextMessage('Please reach us at contact@my-sample-compagny.com for further assistance.'),
      ].map(msg =>
        msg.toJson(userId),
      ),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user.userId).to.be(userId);
    expect(user.conversations.length).to.be(1);
    expect(dialogs.stack.length).to.be(0);
    expect(dialogs.previous.length).to.be(1);
    expect(dialogs.previous[0].name).to.be('qnas');
  });

  it('should respond question about payment options', async function () {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([new UserTextMessage('Can I pay in bitcoins?')]);
    expect(bot.adapter.log).to.eql(
      [
        new UserTextMessage('Can I pay in bitcoins?'),
        new BotTextMessage('You can pay for your purchase with Visa, Mastercard or using a PayPal account.'),
      ].map(msg =>
        msg.toJson(userId),
      ),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user.userId).to.be(userId);
    expect(user.conversations.length).to.be(1);
    expect(dialogs.stack.length).to.be(0);
    expect(dialogs.previous.length).to.be(1);
    expect(dialogs.previous[0].name).to.be('qnas');
  });

  it('should respond to question about shipping policy', async function () {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([new UserTextMessage('Do you ship to France?')]);
    expect(bot.adapter.log).to.eql(
      [
        new UserTextMessage('Do you ship to France?'),
        new BotTextMessage('Your purchase can be shipped worldwide. However, delivery charges may vary.'),
      ].map(msg =>
        msg.toJson(userId),
      ),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user.userId).to.be(userId);
    expect(user.conversations.length).to.be(1);
    expect(dialogs.stack.length).to.be(0);
    expect(dialogs.previous.length).to.be(1);
    expect(dialogs.previous[0].name).to.be('qnas');
  });
});
