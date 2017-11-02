const Message = require('./message');

/**
 * Bot text message
 * @extends Message
 */
class BotTextMessage extends Message {
  /**
   * @constructor
   * @param {String} userId - the user id
   * @param {String} value - the text value
   * @param {Object} [options] - the message options
   */
  constructor(userId, value, options) {
    super('text', 'bot', userId, value, options);
  }
}

module.exports = BotTextMessage;
