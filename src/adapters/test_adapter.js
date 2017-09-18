const Adapter = require('./adapter');
const Messages = require('../messages');

/**
 * Test Adapter.
 */
class TestAdapter extends Adapter {
  constructor(bot, config) {
    console.log('TestAdapter.constructor');
    super(bot, config);
    this.log = [];
    this.userId = 'USER_TEST';
  }

  async play(userMsgs) {
    console.log('TestAdapter.play', userMsgs);
    await this.bot.brain.initUserIfNecessary(this.userId);
    for (const userMsg of userMsgs) {
      const userMessage = Messages.getUserTextMessage(this.config.id, this.userId, userMsg.payload);
      this.log.push(userMessage);
      await this.bot.sendResponse(userMessage);
    }
  }

  async send(botMessages) {
    console.log('TestAdapter.send', botMessages);
    // TODO: adapt to msg type
    for (const botMessage of botMessages) {
      this.log.push(botMessage);
    }
  }
}

module.exports = TestAdapter;
