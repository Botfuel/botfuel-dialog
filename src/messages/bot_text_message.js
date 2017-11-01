const Message = require('./message');

/**
 * Bot text message
 * @extends Message
 */
class BotTextMessage extends Message {
  /**
   * @constructor
   * @param {string} botId - the bot id
   * @param {string} userId - the user id
   * @param {object[]} actions - the actions array
   * @param {object} options - the message options
   */
  constructor(botId, userId, value, options) {
    super('text', 'bot', botId, userId, value, options);
  }
}

module.exports = BotTextMessage;
