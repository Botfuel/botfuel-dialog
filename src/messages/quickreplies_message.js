const Message = require('./message');

/**
 * Quickreplies message
 * @extends Message
 */
class QuickrepliesMessage extends Message {
  /**
   * @constructor
   * @param {String} botId - the bot id
   * @param {String} userId - the user id
   * @param {String[]} texts - the array of texts
   * @param {Object} options - the message options
   */
  constructor(botId, userId, texts, options) {
    super('quickreplies', 'bot', botId, userId, texts, options);
  }
}

module.exports = QuickrepliesMessage;
