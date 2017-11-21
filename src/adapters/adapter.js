const logger = require('logtown')('Adapter');
const { MissingImplementationError } = require('../errors');

/**
 * An adapter adapts the messages to the messaging platform.
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
   * This adapter is only implemented by the {@link TestAdapter}.
   * This method is called by the {@link Bot}'s play method.
   * @abstract
   * @async
   * @param {Object[]} userMessages - the user messages
   * @returns {Promise.<void>}
   */
  async play(userMessages) {
    logger.debug('play', userMessages);
    throw new MissingImplementationError();
  }

  /**
   * Adapter's method for running the bot.
   * This method is called by the {@link Bot}'s run method.
   * @abtract
   * @async
   * @returns {Promise.<void>}
   */
  async run() {
    logger.debug('run');
    throw new MissingImplementationError();
  }

  /**
   * Iterates over the bot messages and send them to the messaging platform.
   * @async
   * @param {Object[]} botMessages - the bot messages
   * @returns {Promise.<void>}
   */
  async send(botMessages) {
    logger.debug('send', botMessages);
    for (const botMessage of botMessages) {
      // eslint-disable-next-line no-await-in-loop
      await this.sendMessage(botMessage);
    }
  }

  /**
   * Sends a single bot message to the messaging platform.
   * @abstract
   * @async
   * @param {Object} botMessage - the bot message
   * @returns {Promise.<void>}
   */
  async sendMessage() {
    throw new MissingImplementationError();
  }
}

module.exports = Adapter;
