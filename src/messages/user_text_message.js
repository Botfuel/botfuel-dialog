const Message = require('./message');

/**
 * User text message
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
