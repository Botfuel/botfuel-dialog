const Message = require('./message');

/**
 * UserTextMessage
 * @class
 * @classdesc a user text message
 * @extends Message
 * @param {string|number} botId - the bot id
 * @param {string|number} userId - the user id
 * @param {string} text - the message
 * @param {object} options - the message options
 */
class UserTextMessage extends Message {
  constructor(botId, userId, text, options) {
    super('text', 'user', botId, userId, text, options);
  }
}

module.exports = UserTextMessage;
