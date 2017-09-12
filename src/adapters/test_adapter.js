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
    await this.initUserIfNecessary(this.userId);
    for (const userMessage of userMessages) {
      userMessage.userId = this.userId;
      userMessage.botId = this.config.id;
      userMessage.origin = 'user';
      this.log.push(userMessage);
      await this.bot.sendResponse(userMessage);
    }
  }

  async send(botMessages) {
    console.log('TestAdapter.send', botMessages);
    for (const botMessage of botMessages) {
      this.log.push(botMessage);
    }
  }
}

module.exports = TestAdapter;
