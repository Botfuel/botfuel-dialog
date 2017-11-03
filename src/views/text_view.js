const logger = require('logtown')('TextView');
const { BotTextMessage } = require('../messages');
const View = require('./view');

/**
 * Text view
 */
class TextView extends View {
  /**
   * Renders an array of BotTextMessages.
   * @param {String} key - the dialog key
   * @param {Object} [parameters] - the optional dialog parameters
   * @returns {BotTextMessage[]} the array of bot text messages
   */
  render(key, parameters) {
    logger.debug('render', key, parameters);
    return this
      .getTexts(parameters)
      .map(text => new BotTextMessage(text));
  }

  /**
   * Gets views texts
   * @param {Object} [parameters={}] - the optional dialog parameters
   * @returns {String[]}
   */
  getTexts(parameters = {}) {
    logger.debug('getTexts', parameters);
    return [];
  }
}

module.exports = TextView;
