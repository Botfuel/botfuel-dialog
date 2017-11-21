const Message = require('./message');

/**
 * A user message containing an image.
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
