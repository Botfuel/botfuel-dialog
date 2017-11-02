const Message = require('./message');

/**
 * User text message
 * @extends Message
 */
class UserTextMessage extends Message {
  /**
   * @constructor
   * @param {String} userId - the user id
   * @param {String} text - the message
   * @param {Object} [options] - the message options
   */
  constructor(userId, text, options) {
    super('text', 'user', userId, text, options);
  }
}

module.exports = UserTextMessage;
