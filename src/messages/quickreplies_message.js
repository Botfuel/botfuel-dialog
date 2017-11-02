const Message = require('./message');

/**
 * Quickreplies message
 * @extends Message
 */
class QuickrepliesMessage extends Message {
  /**
   * @constructor
   * @param {String} userId - the user id
   * @param {String[]} texts - the array of texts
   * @param {Object} [options] - the message options
   */
  constructor(userId, texts, options) {
    super('quickreplies', 'bot', userId, texts, options);
  }
}

module.exports = QuickrepliesMessage;
