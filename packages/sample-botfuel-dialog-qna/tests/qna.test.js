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

const QNA_BEFORE_NOT_STRICT = {
  qna: {
    when: 'before',
    strict: false,
  },
};

const QNA_BEFORE_STRICT = {
  qna: {
    when: 'before',
    strict: true,
  },
};

const QNA_AFTER_NOT_STRICT = {
  qna: {
    when: 'after',
    strict: false,
  },
};

const QNA_AFTER_STRICT = {
  qna: {
    when: 'after',
    strict: true,
  },
};

describe('Qna', () => {
  // before not strict configuration means that the bot will compute answers
  // with qna first and using the sdk if no results
  describe('Before not strict', () => {
    it('should respond with qna and not sdk', async function () {
      const bot = new Bot(Object.assign(config, QNA_BEFORE_STRICT));
      const userId = bot.adapter.userId;
      await bot.play([new UserTextMessage('Hello')]);
      expect(bot.adapter.log).to.eql(
        [new UserTextMessage('Hello'), new BotTextMessage('Hey, how are you ?')].map(msg =>
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

    it('should respond with many qnas when question not fully understood', async function () {
      const bot = new Bot(Object.assign(config, QNA_BEFORE_NOT_STRICT));
      const userId = bot.adapter.userId;
      await bot.play([new UserTextMessage("What's the weather ?")]);
      expect(bot.adapter.log).to.eql(
        [
          new UserTextMessage("What's the weather ?"),
          new BotTextMessage('What do you mean?'),
          new ActionsMessage([
            new Postback("What's the weather tomorrow ?", 'qnas', [
              {
                dim: 'qnas',
                value: [{ answer: 'Partly cloudy.' }],
              },
            ]),
            new Postback("What's the weather today ?", 'qnas', [
              {
                dim: 'qnas',
                value: [{ answer: "It's sunny !" }],
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

    it('should respond with only one qna when understood', async function () {
      const bot = new Bot(Object.assign(config, QNA_BEFORE_NOT_STRICT));
      const userId = bot.adapter.userId;
      await bot.play([new UserTextMessage('What kind of weather can I expect for Christmas ?')]);
      expect(bot.adapter.log).to.eql(
        [
          new UserTextMessage('What kind of weather can I expect for Christmas ?'),
          new BotTextMessage('The weather will be snowy for Christmas !'),
        ].map(msg => msg.toJson(userId)),
      );
      const user = await bot.brain.getUser(userId);
      const dialogs = await bot.brain.getDialogs(userId);
      expect(user.userId).to.be(userId);
      expect(user.conversations.length).to.be(1);
      expect(dialogs.stack).to.be.empty();
      expect(dialogs.previous.length).to.be(1);
      expect(dialogs.previous[0].name).to.be('qnas');
    });

    it('should respond when no local and qnas results found', async function () {
      const bot = new Bot(Object.assign(config, QNA_BEFORE_NOT_STRICT));
      const userId = bot.adapter.userId;
      await bot.play([new UserTextMessage('Where is bryan ?')]);
      expect(bot.adapter.log).to.eql(
        [new UserTextMessage('Where is bryan ?'), new BotTextMessage('Not understood.')].map(msg =>
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
  });

  // before strict configuration means that the bot will compute answers
  // with qna first and build the result only if there is only one answer returned by qna
  // and use the sdk otherwise
  describe('Before strict', () => {
    it('should respond with qna and not sdk', async function () {
      const bot = new Bot(Object.assign(config, QNA_BEFORE_STRICT));
      const userId = bot.adapter.userId;
      await bot.play([new UserTextMessage('Hello')]);
      expect(bot.adapter.log).to.eql(
        [new UserTextMessage('Hello'), new BotTextMessage('Hey, how are you ?')].map(msg =>
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

    it('should NOT respond with many qnas when question not fully understood', async function () {
      const bot = new Bot(Object.assign(config, QNA_BEFORE_STRICT));
      const userId = bot.adapter.userId;
      await bot.play([new UserTextMessage("What's the weather ?")]);
      expect(bot.adapter.log).to.eql(
        [new UserTextMessage("What's the weather ?"), new BotTextMessage('Not understood.')].map(
          msg => msg.toJson(userId),
        ),
      );
      const user = await bot.brain.getUser(userId);
      const dialogs = await bot.brain.getDialogs(userId);
      expect(user.userId).to.be(userId);
      expect(user.conversations.length).to.be(1);
      expect(dialogs.stack.length).to.be(0);
      expect(dialogs.previous.length).to.be(1);
      expect(dialogs.previous[0].name).to.be('default');
    });

    it('should respond with only one qna when understood', async function () {
      const bot = new Bot(Object.assign(config, QNA_BEFORE_STRICT));
      const userId = bot.adapter.userId;
      await bot.play([new UserTextMessage('What kind of weather can I expect for Christmas ?')]);
      expect(bot.adapter.log).to.eql(
        [
          new UserTextMessage('What kind of weather can I expect for Christmas ?'),
          new BotTextMessage('The weather will be snowy for Christmas !'),
        ].map(msg => msg.toJson(userId)),
      );
      const user = await bot.brain.getUser(userId);
      const dialogs = await bot.brain.getDialogs(userId);
      expect(user.userId).to.be(userId);
      expect(user.conversations.length).to.be(1);
      expect(dialogs.stack).to.be.empty();
      expect(dialogs.previous.length).to.be(1);
      expect(dialogs.previous[0].name).to.be('qnas');
    });

    it('should respond when no local and qnas results found', async function () {
      const bot = new Bot(Object.assign(config, QNA_BEFORE_STRICT));
      const userId = bot.adapter.userId;
      await bot.play([new UserTextMessage('Where is bryan ?')]);
      expect(bot.adapter.log).to.eql(
        [new UserTextMessage('Where is bryan ?'), new BotTextMessage('Not understood.')].map(msg =>
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
  });

  // after not strict configuration means that the bot will compute answers
  // with the sdk first and using qna if no results
  describe('After not strict', () => {
    it('should respond with sdk and not qna', async function () {
      const bot = new Bot(Object.assign(config, QNA_AFTER_NOT_STRICT));
      const userId = bot.adapter.userId;
      await bot.play([new UserTextMessage('Hello')]);
      expect(bot.adapter.log).to.eql(
        [new UserTextMessage('Hello'), new BotTextMessage('Hello human!')].map(msg =>
          msg.toJson(userId),
        ),
      );
      const user = await bot.brain.getUser(userId);
      const dialogs = await bot.brain.getDialogs(userId);
      expect(user.userId).to.be(userId);
      expect(user.conversations.length).to.be(1);
      expect(dialogs.stack.length).to.be(0);
      expect(dialogs.previous.length).to.be(1);
      expect(dialogs.previous[0].name).to.be('greetings');
    });

    it('should respond with many qnas when question not fully understood', async function () {
      const bot = new Bot(Object.assign(config, QNA_AFTER_NOT_STRICT));
      const userId = bot.adapter.userId;
      await bot.play([new UserTextMessage("What's the weather ?")]);
      expect(bot.adapter.log).to.eql(
        [
          new UserTextMessage("What's the weather ?"),
          new BotTextMessage('What do you mean?'),
          new ActionsMessage([
            new Postback("What's the weather tomorrow ?", 'qnas', [
              {
                dim: 'qnas',
                value: [{ answer: 'Partly cloudy.' }],
              },
            ]),
            new Postback("What's the weather today ?", 'qnas', [
              {
                dim: 'qnas',
                value: [{ answer: "It's sunny !" }],
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

    it('should respond with only one qna when understood', async function () {
      const bot = new Bot(Object.assign(config, QNA_AFTER_NOT_STRICT));
      const userId = bot.adapter.userId;
      await bot.play([new UserTextMessage('What kind of weather can I expect for Christmas ?')]);
      expect(bot.adapter.log).to.eql(
        [
          new UserTextMessage('What kind of weather can I expect for Christmas ?'),
          new BotTextMessage('The weather will be snowy for Christmas !'),
        ].map(msg => msg.toJson(userId)),
      );
      const user = await bot.brain.getUser(userId);
      const dialogs = await bot.brain.getDialogs(userId);
      expect(user.userId).to.be(userId);
      expect(user.conversations.length).to.be(1);
      expect(dialogs.stack).to.be.empty();
      expect(dialogs.previous.length).to.be(1);
      expect(dialogs.previous[0].name).to.be('qnas');
    });

    it('should respond when no local and qnas results found', async function () {
      const bot = new Bot(Object.assign(config, QNA_AFTER_NOT_STRICT));
      const userId = bot.adapter.userId;
      await bot.play([new UserTextMessage('Where is bryan ?')]);
      expect(bot.adapter.log).to.eql(
        [new UserTextMessage('Where is bryan ?'), new BotTextMessage('Not understood.')].map(msg =>
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
  });

  // after strict configuration means that the bot will compute answers
  // with the sdk first and using qna if no results
  // then build results only if there is only one answer returned by qna
  describe('After strict', () => {
    it('should respond with sdk and not qna', async function () {
      const bot = new Bot(Object.assign(config, QNA_AFTER_STRICT));
      const userId = bot.adapter.userId;
      await bot.play([new UserTextMessage('Hello')]);
      expect(bot.adapter.log).to.eql(
        [new UserTextMessage('Hello'), new BotTextMessage('Hello human!')].map(msg =>
          msg.toJson(userId),
        ),
      );
      const user = await bot.brain.getUser(userId);
      const dialogs = await bot.brain.getDialogs(userId);
      expect(user.userId).to.be(userId);
      expect(user.conversations.length).to.be(1);
      expect(dialogs.stack.length).to.be(0);
      expect(dialogs.previous.length).to.be(1);
      expect(dialogs.previous[0].name).to.be('greetings');
    });

    it('should NOT respond with many qnas when question not fully understood', async function () {
      const bot = new Bot(Object.assign(config, QNA_AFTER_STRICT));
      const userId = bot.adapter.userId;
      await bot.play([new UserTextMessage("What's the weather ?")]);
      expect(bot.adapter.log).to.eql(
        [new UserTextMessage("What's the weather ?"), new BotTextMessage('Not understood.')].map(
          msg => msg.toJson(userId),
        ),
      );
      const user = await bot.brain.getUser(userId);
      const dialogs = await bot.brain.getDialogs(userId);
      expect(user.userId).to.be(userId);
      expect(user.conversations.length).to.be(1);
      expect(dialogs.stack.length).to.be(0);
      expect(dialogs.previous.length).to.be(1);
      expect(dialogs.previous[0].name).to.be('default');
    });

    it('should respond with only one qna when understood', async function () {
      const bot = new Bot(Object.assign(config, QNA_AFTER_STRICT));
      const userId = bot.adapter.userId;
      await bot.play([new UserTextMessage('What kind of weather can I expect for Christmas ?')]);
      expect(bot.adapter.log).to.eql(
        [
          new UserTextMessage('What kind of weather can I expect for Christmas ?'),
          new BotTextMessage('The weather will be snowy for Christmas !'),
        ].map(msg => msg.toJson(userId)),
      );
      const user = await bot.brain.getUser(userId);
      const dialogs = await bot.brain.getDialogs(userId);
      expect(user.userId).to.be(userId);
      expect(user.conversations.length).to.be(1);
      expect(dialogs.stack).to.be.empty();
      expect(dialogs.previous.length).to.be(1);
      expect(dialogs.previous[0].name).to.be('qnas');
    });

    it('should respond when no local and qnas results found', async function () {
      const bot = new Bot(Object.assign(config, QNA_AFTER_STRICT));
      const userId = bot.adapter.userId;
      await bot.play([new UserTextMessage('Where is bryan ?')]);
      expect(bot.adapter.log).to.eql(
        [new UserTextMessage('Where is bryan ?'), new BotTextMessage('Not understood.')].map(msg =>
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
  });
});
