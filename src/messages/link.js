const Action = require('./action');

/**
 * Link
 * @class
 * @classdesc a link action
 * @extends Action
 * @param {string} text - the link title
 * @param {string} value - the link url
 */
class Link extends Action {
  constructor(text, value) {
    super('link', text, value);
  }
}

module.exports = Link;
