const Action = require('./action');

/**
 * Postback action
 * @extends Action
 */
class Postback extends Action {
  /**
   * @constructor
   * @param {string} text - the postback text
   * @param {string} dialog - the postback dialog name
   * @param {object[]} entities - the dialog entities
   */
  constructor(text, dialog, entities) {
    super('postback', text, { dialog, entities });
  }
}

module.exports = Postback;
