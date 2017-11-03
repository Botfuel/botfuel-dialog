const Message = require('./message');

/**
 * Bot text message
 * @extends Message
 */
class BotTextMessage extends Message {
  /**
   * @constructor
   * @param {String} value - the text value
   * @param {Object} [options] - the optional message options
   */
  constructor(value, options) {
    super('text', 'bot', value, options);
  }
}

module.exports = BotTextMessage;
