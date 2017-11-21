const logger = require('logtown')('TestAdapter');
const Adapter = require('./adapter');

/**
 * Adapter used for running tests.
 * @extends Adapter
 */
class TestAdapter extends Adapter {
  /**
   * @constructor
   * @param {Object} bot - the bot
   * @param {Object} config - the bot config
   */
  constructor(bot, config) {
    logger.debug('constructor');
    super(bot, config);
    this.log = [];
    this.userId = 'USER_TEST';
  }

  // eslint-disable-next-line require-jsdoc
  async play(userMessages) {
    await this.bot.brain.initUserIfNecessary(this.userId);
    for (const userMessage of userMessages) {
      const userMessageAsJson = userMessage.toJson(this.bot.id, this.userId);
      this.log.push(userMessageAsJson);
      // eslint-disable-next-line no-await-in-loop
      await this.bot.respond(userMessageAsJson);
    }
  }

  // eslint-disable-next-line require-jsdoc
  async sendMessage(botMessage) {
    this.log.push(botMessage);
  }
}

module.exports = TestAdapter;
