const Message = require('./message');

/**
 * ActionsMessage
 * @class
 * @classdesc a message with many actions
 * @extends Message
 * @param {string|number} botId - the bot id
 * @param {string|number} userId - the user id
 * @param {object[]} actions - the actions array
 * @param {object} options - the message options
 */
class ActionsMessage extends Message {
  constructor(botId, userId, actions, options) {
    super('actions', 'bot', botId, userId, actions.map(action => action.toJson()), options);
  }
}

module.exports = ActionsMessage;
