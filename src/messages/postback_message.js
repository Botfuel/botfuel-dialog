const Message = require('./message');

/**
 * PostbackMessage
 * @class
 * @classdesc A postback message corresponds to a user action.
 * @param {string|number} botId - the bot id
 * @param {string|number} userId - the user id
 * @param {string} dialog - the postback dialog name
 * @param {object[]} entities - the dialog entities
 */
class PostbackMessage extends Message {
  constructor(botId, userId, dialog, entities) {
    super('postback', 'user', botId, userId, { dialog, entities });
  }
}

module.exports = PostbackMessage;
