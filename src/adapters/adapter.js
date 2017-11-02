const logger = require('logtown')('Adapter');

/**
 * Adapts messages to a messaging platform.
 */
class Adapter {
  /**
   * @constructor
   * @param {Object} bot - the bot
   * @param {Object} config - the bot config
   */
  constructor(bot, config) {
    logger.debug('constructor', bot, config);
    this.config = config;
    this.bot = bot;
  }

  /**
   * Plays user messages
   * @async
   * @param {Object[]} userMessages - the user messages
   * @returns {Promise.<void>}
   */
  async play(userMessages) {
    logger.debug('play', userMessages);
    throw new Error('Not implemented!');
  }

  /**
   * Runs bot adapter
   * @async
   * @returns {Promise.<void>}
   */
  async run() {
    logger.debug('run');
    throw new Error('Not implemented!');
  }

  /**
   * Sends bot messages to the platform
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
