const Adapter = require('./adapter');

const USER_ID = 'USER_TEST';

/**
 * Test Adapter.
 */
class TestAdapter extends Adapter {
  constructor(bot, config) {
    console.log('TestAdapter.constructor');
    super(bot, config);
    this.log = [];
  }

  async play(userMessages) {
    console.log('TestAdapter.play', userMessages);
    await this.initUserIfNecessary(USER_ID);
    for (const userMessage of userMessages) {
      userMessage.userId = USER_ID;
      userMessage.botId = this.config.id;
      userMessage.origin = 'user';
      this.log.push(userMessage);
      await this.bot.respond(userMessage);
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
