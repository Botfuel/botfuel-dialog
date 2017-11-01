const Action = require('./action');

/**
 * Link action
 * @extends Action
 */
class Link extends Action {
  /**
   * @constructor
   * @param {String} text - the link title
   * @param {String} value - the link url
   */
  constructor(text, value) {
    super('link', text, value);
  }
}

module.exports = Link;
