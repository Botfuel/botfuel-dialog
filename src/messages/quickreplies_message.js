const Message = require('./message');

/**
 * QuickrepliesMessage
 * @class
 * @classdesc a message with quick replies
 * @extends Message
 * @param {string} botId - the bot id
 * @param {string} userId - the user id
 * @param {string[]} texts - the array of texts
 * @param {object} options - the message options
 */
class QuickrepliesMessage extends Message {
  constructor(botId, userId, texts, options) {
    super('quickreplies', 'bot', botId, userId, texts, options);
  }
}

module.exports = QuickrepliesMessage;
