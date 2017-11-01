const Message = require('./message');

/**
 * Quickreplies message
 * @extends Message
 */
class QuickrepliesMessage extends Message {
  /**
   * @constructor
   * @param {string} botId - the bot id
   * @param {string} userId - the user id
   * @param {string[]} texts - the array of texts
   * @param {object} options - the message options
   */
  constructor(botId, userId, texts, options) {
    super('quickreplies', 'bot', botId, userId, texts, options);
  }
}

module.exports = QuickrepliesMessage;
