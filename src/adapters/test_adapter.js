const Messages = require('../messages');
const Adapter = require('./adapter');

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

  async play(userMessages) {
    console.log('TestAdapter.play', userMessages);
    await this.bot.brain.initUserIfNecessary(this.userId);
    for (const userMessage of userMessages) {
      this.log.push(userMessage);
      // eslint-disable-next-line no-await-in-loop
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
