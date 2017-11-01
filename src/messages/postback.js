const Action = require('./action');

/**
 * Postback
 * @class
 * @classdesc a postback action
 * @extends Action
 * @param {string} text - the postback text
 * @param {string} dialog - the postback dialog name
 * @param {object[]} entities - the dialog entities
 */
class Postback extends Action {
  constructor(text, dialog, entities) {
    super('postback', text, { dialog, entities });
  }
}

module.exports = Postback;
