const Message = require('./message');

/**
 * User image message
 * @extends Message
 */
class UserImageMessage extends Message {
  /**
   * @constructor
   * @param {String} botId - the bot id
   * @param {String} userId - the user id
   * @param {String} value - the image url
   */
  constructor(botId, userId, value) {
    super('image', 'user', botId, userId, value);
  }
}

module.exports = UserImageMessage;
