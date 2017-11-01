const Message = require('./message');

/**
 * User image message
 * @extends Message
 */
class UserImageMessage extends Message {
  /**
   * @constructor
   * @param {string} botId - the bot id
   * @param {string} userId - the user id
   * @param {string} value - the image url
   */
  constructor(botId, userId, value) {
    super('image', 'user', botId, userId, value);
  }
}

module.exports = UserImageMessage;
