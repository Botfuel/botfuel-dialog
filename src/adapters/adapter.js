const logger = require('logtown')('Adapter');

/**
 * Adapts messages to a messaging platform.
 */
class Adapter {
  /**
   * @constructor
   * @param {string} botId - the bot id
   * @param {object} config - the bot config
   */
  constructor(botId, config) {
    logger.debug('constructor', botId, config);
    this.config = config;
    this.bot = botId;
  }

  /**
   * Play user messages
   * @async
   * @param {object[]} userMessages - the user messages
   */
  async play(userMessages) {
    logger.debug('play', userMessages);
    throw new Error('Not implemented!');
  }

  /**
   * Run bot adapter
   * @async
   */
  async run() {
    logger.debug('run');
    throw new Error('Not implemented!');
  }

  /**
   * Send bot messages to the platform
   * @async
   * @param {object[]} botMessages - the bot messages
   */
  async send(botMessages) {
    logger.debug('send', botMessages);
    throw new Error('Not implemented!');
  }
}

module.exports = Adapter;
