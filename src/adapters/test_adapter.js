const logger = require('logtown')('TestAdapter');
const Adapter = require('./adapter');

/**
 * Test adapter
 * @extends Adapter
 */
class TestAdapter extends Adapter {
  /**
   * @constructor
   * @param {String} botId - the bot id
   * @param {Object} config - the bot config
   */
  constructor(botId, config) {
    logger.debug('constructor');
    super(botId, config);
    this.log = [];
    this.userId = 'USER_TEST';
  }

  /**
   * Play user messages
   * @async
   * @param {Object[]} userMessages - the user messages
   * @returns {Promise.<void>}
   */
  async play(userMessages) {
    await this.bot.brain.initUserIfNecessary(this.userId);
    for (const userMessage of userMessages.map(msg => msg.toJson())) {
      logger.debug('play', userMessage);
      this.log.push(userMessage);
      // eslint-disable-next-line no-await-in-loop
      await this.bot.sendResponse(userMessage);
    }
  }

  /**
   * Send bot messages to the platform
   * @async
   * @param {Object[]} botMessages - the bot messages
   * @returns {Promise.<void>}
   */
  async send(botMessages) {
    logger.debug('send', botMessages);
    for (const botMessage of botMessages) {
      this.log.push(botMessage);
    }
  }
}

module.exports = TestAdapter;
