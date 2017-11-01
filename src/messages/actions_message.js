const Message = require('./message');

/**
 * Actions message
 * @extends Message
 */
class ActionsMessage extends Message {
  /**
   * @constructor
   * @param {string} botId - the bot id
   * @param {string} userId - the user id
   * @param {object[]} actions - the actions array
   * @param {object} options - the message options
   */
  constructor(botId, userId, actions, options) {
    super('actions', 'bot', botId, userId, actions.map(action => action.toJson()), options);
  }
}

module.exports = ActionsMessage;
