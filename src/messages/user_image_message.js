const Message = require('./message');

/**
 * UserImageMessage
 * @class
 * @classdesc a user image message
 * @extends Message
 * @param {string|number} botId - the bot id
 * @param {string|number} userId - the user id
 * @param {string} value - the image url
 */
class UserImageMessage extends Message {
  constructor(botId, userId, value) {
    super('image', 'user', botId, userId, value);
  }
}

module.exports = UserImageMessage;
