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

  valueAsJson() {
    return this.value.map(action => action.toJson())
  }
}

module.exports = ActionsMessage;
