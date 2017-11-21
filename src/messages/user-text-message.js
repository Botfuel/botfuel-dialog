const Message = require('./message');

/**
 * A text message send by the user to the bot.
 * @extends Message
 */
class UserTextMessage extends Message {
  /**
   * @constructor
   * @param {String} text - the message
   * @param {Object} [options] - the message options
   */
  constructor(text, options) {
    super('text', 'user', text, options);
  }
}

module.exports = UserTextMessage;
