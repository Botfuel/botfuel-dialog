const Message = require('./message');

/**
 * A message containing quick replies.
 * @extends Message
 */
class QuickrepliesMessage extends Message {
  /**
   * @constructor
   * @param {String[]} texts - the array of texts
   * @param {Object} options - the message options
   */
  constructor(texts, options) {
    super('quickreplies', 'bot', texts, options);
  }
}

module.exports = QuickrepliesMessage;
