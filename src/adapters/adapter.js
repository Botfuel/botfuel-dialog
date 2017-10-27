const logger = require('logtown').getLogger('Adapter');

/**
 * Adapts messages.
 */
class Adapter {
  constructor(bot, config) {
    logger.debug('constructor', '<bot>', config);
    this.config = config;
    this.bot = bot;
  }

  async play(userMsgs) {
    logger.debug('play', userMsgs);
    throw new Error('Not implemented!');
  }

  async run() {
    logger.debug('run');
    throw new Error('Not implemented!');
  }

  /**
   * @param botMessages
   * @returns {Promise}
   */
  async send(botMessages) {
    logger.debug('send', botMessages);
    throw new Error('Not implemented!');
  }
}

module.exports = Adapter;
