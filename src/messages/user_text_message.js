const Message = require('./message');

/**
 * User text message
 * @extends Message
 */
class UserTextMessage extends Message {
  /**
   * @constructor
   * @param {String} botId - the bot id
   * @param {String} userId - the user id
   * @param {String} text - the message
   * @param {Object} options - the message options
   */
  constructor(botId, userId, text, options) {
    super('text', 'user', botId, userId, text, options);
  }
}

module.exports = UserTextMessage;
