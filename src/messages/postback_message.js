const Message = require('./message');

/**
 * Postback message
 * @extends Message
 */
class PostbackMessage extends Message {
  /**
   * @constructor
   * @param {String} botId - the bot id
   * @param {String} userId - the user id
   * @param {String} dialog - the postback dialog name
   * @param {Object[]} entities - the dialog entities
   */
  constructor(botId, userId, dialog, entities) {
    super('postback', 'user', botId, userId, { dialog, entities });
  }
}

module.exports = PostbackMessage;
