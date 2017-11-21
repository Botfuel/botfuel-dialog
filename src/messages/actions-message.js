const Message = require('./message');

/**
 * A message made of actions.
 * @extends Message
 */
class ActionsMessage extends Message {
  /**
   * @constructor
   * @param {Object[]} actions - the actions
   * @param {Object} options - the message options
   */
  constructor(actions, options) {
    super('actions', 'bot', actions, options);
  }

  // eslint-disable-next-line require-jsdoc
  valueAsJson() {
    return this.value.map(action => action.toJson());
  }
}

module.exports = ActionsMessage;
