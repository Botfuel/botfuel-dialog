const Message = require('./message');

/**
 * User image message
 * @extends Message
 */
class UserImageMessage extends Message {
  /**
   * @constructor
   * @param {String} value - the image url
   */
  constructor(value) {
    super('image', 'user', value);
  }
}

module.exports = UserImageMessage;
