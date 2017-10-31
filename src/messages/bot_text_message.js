const Message = require('./message');

/**
 * BotTextMessage
 * @class
 * @classdesc a bot text message
 * @extends Message
 * @param {string|number} botId - the bot id
 * @param {string|number} userId - the user id
 * @param {object[]} actions - the actions array
 * @param {object} options - the message options
 */
class BotTextMessage extends Message {
  constructor(botId, userId, value, options) {
    super('text', 'bot', botId, userId, value, options);
  }
}

module.exports = BotTextMessage;
