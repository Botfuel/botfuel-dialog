const Message = require('./message');

/**
 * Actions message
 * @extends Message
 */
class ActionsMessage extends Message {
  /**
   * @constructor
   * @param {String} userId - the user id
   * @param {Object[]} actions - the actions array
   * @param {Object} [options] - the message options
   */
  constructor(userId, actions, options) {
    super('actions', 'bot', userId, actions.map(action => action.toJson()), options);
  }
}

module.exports = ActionsMessage;
