const Message = require('./message');

/**
 * A text message sent by the bot to the user.
 * @extends Message
 */
class BotTextMessage extends Message {
  /**
   * @constructor
   * @param {String} value - the text value
   * @param {Object} [options] - the message options
   */
  constructor(value, options) {
    super('text', 'bot', value, options);
  }
}

module.exports = BotTextMessage;
