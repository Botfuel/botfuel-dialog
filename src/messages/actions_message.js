const Message = require('./message');

/**
 * Actions message
 * @extends Message
 */
class ActionsMessage extends Message {
  /**
   * @constructor
   * @param {String} botId - the bot id
   * @param {String} userId - the user id
   * @param {Object[]} actions - the actions array
   * @param {Object} options - the message options
   */
  constructor(botId, userId, actions, options) {
    super('actions', 'bot', botId, userId, actions.map(action => action.toJson()), options);
  }
}

module.exports = ActionsMessage;
