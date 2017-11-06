const logger = require('logtown')('TextView');
const { BotTextMessage } = require('../messages');
const View = require('./view');

/**
 * View that renders text messages only.
 * @extends View
 */
class TextView extends View {
  render(key, parameters) {
    logger.debug('render', key, parameters);
    return this
      .getTexts(parameters)
      .map(text => new BotTextMessage(text));
  }

  /**
   * Gets the texts used for building the BotTextMessages.
   * @param {Object} [parameters={}] - optional dialog parameters
   * @returns {String[]} an array of strings
   */
  getTexts(parameters = {}) {
    logger.debug('getTexts', parameters);
    return [];
  }
}

module.exports = TextView;
