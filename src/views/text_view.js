const logger = require('logtown')('TextView');
const { BotTextMessage } = require('../messages');

/**
 * Text view
 */
class TextView {
  /**
   * Render an array of BotTextMessages
   * @param {String} key - the dialog key
   * @param {Object} parameters - the dialog parameters
   * @returns {BotTextMessage[]} the array of bot text messages
   */
  render(key, parameters) {
    logger.debug('render', key, parameters);
    return this
      .getTexts(parameters)
      .map(text => new BotTextMessage(text));
  }

  /**
   * Get views texts
   * @returns {String[]}
   * @param {Object} [parameters={}] - the dialog parameters
   */
  getTexts(parameters = {}) {
    logger.debug('getTexts', parameters);
    return [];
  }
}

module.exports = TextView;
