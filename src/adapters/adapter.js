const logger = require('logtown')('Adapter');

/**
 * Adapts messages to a messaging platform.
 */
class Adapter {
  /**
   * @constructor
   * @param {String} botId - the bot id
   * @param {Object} config - the bot config
   */
  constructor(botId, config) {
    logger.debug('constructor', botId, config);
    this.config = config;
    this.bot = botId;
  }

  /**
   * Play user messages
   * @async
   * @param {Object[]} userMessages - the user messages
   * @returns {Promise.<void>}
   */
  async play(userMessages) {
    logger.debug('play', userMessages);
    throw new Error('Not implemented!');
  }

  /**
   * Run bot adapter
   * @async
   * @returns {Promise.<void>}
   */
  async run() {
    logger.debug('run');
    throw new Error('Not implemented!');
  }

  /**
   * Send bot messages to the platform
   * @async
   * @param {Object[]} botMessages - the bot messages
   * @returns {Promise.<void>}
   */
  async send(botMessages) {
    logger.debug('send', botMessages);
    throw new Error('Not implemented!');
  }
}

module.exports = Adapter;
