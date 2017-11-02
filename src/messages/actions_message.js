const Message = require('./message');

/**
 * Actions message
 * @extends Message
 */
class ActionsMessage extends Message {
  /**
   * @constructor
   * @param {Object[]} actions - the actions array
   * @param {Object} options - the message options
   */
  constructor(actions, options) {
    super('actions', 'bot', actions, options);
  }

  /**
   * Maps actions to json objects
   * @returns {Object[]} the json actions
   */
  valueAsJson() {
    return this.value.map(action => action.toJson());
  }
}

module.exports = ActionsMessage;
