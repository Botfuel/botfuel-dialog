const logger = require('logtown')('Adapter');

/**
 * An adapter for a given messaging platform adapts the messages to the messaging platform.
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
   * Plays some user messages.
   * @async
   * @param {Object[]} userMessages - the user messages
   * @returns {Promise.<void>}
   */
  async play(userMessages) {
    logger.debug('play', userMessages);
    throw new Error('Not implemented!');
  }

  /**
   * Adapter's method for running the bot.
   * @async
   * @returns {Promise.<void>}
   */
  async run() {
    logger.debug('run');
    throw new Error('Not implemented!');
  }

  /**
   * Sends the bot messages to the messaging platform.
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
