const Message = require('./message');

/**
 * User image message
 * @extends Message
 */
class UserImageMessage extends Message {
  /**
   * @constructor
   * @param {String} userId - the user id
   * @param {String} value - the image url
   * @param {Object} [options] - the message options
   */
  constructor(userId, value, options) {
    super('image', 'user', userId, value, options);
  }
}

module.exports = UserImageMessage;
