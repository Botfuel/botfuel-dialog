const Message = require('./message');

/**
 * Quickreplies message
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
