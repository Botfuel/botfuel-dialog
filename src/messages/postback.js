const Action = require('./action');

/**
 * A postback action.
 * @extends Action
 */
class Postback extends Action {
  /**
   * @constructor
   * @param {String} text - the postback text
   * @param {String} dialog - the postback dialog name
   * @param {Object[]} entities - the dialog entities
   */
  constructor(text, dialog, entities) {
    super('postback', text, { dialog, entities });
  }
}

module.exports = Postback;
