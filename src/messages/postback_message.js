const Message = require('./message');

/**
 * Postback message
 * @extends Message
 */
class PostbackMessage extends Message {
  /**
   * @constructor
   * @param {string} botId - the bot id
   * @param {string} userId - the user id
   * @param {string} dialog - the postback dialog name
   * @param {object[]} entities - the dialog entities
   */
  constructor(botId, userId, dialog, entities) {
    super('postback', 'user', botId, userId, { dialog, entities });
  }
}

module.exports = PostbackMessage;
