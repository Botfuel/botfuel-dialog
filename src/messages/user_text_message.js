const Message = require('./message');

/**
 * User text message
 * @extends Message
 */
class UserTextMessage extends Message {
  /**
   * @constructor
   * @param {string} botId - the bot id
   * @param {string} userId - the user id
   * @param {string} text - the message
   * @param {object} options - the message options
   */
  constructor(botId, userId, text, options) {
    super('text', 'user', botId, userId, text, options);
  }
}

module.exports = UserTextMessage;
