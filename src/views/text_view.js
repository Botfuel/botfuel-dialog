const logger = require('logtown')('TextView');
const { BotTextMessage } = require('../messages');
const View = require('./view');

/**
 * View that renders text messages only.
 * @extends View
 */
class TextView extends View {
  // eslint-disable-next-line require-jsdoc
  render(key, data) {
    logger.debug('render', key, data);
    return this
      .getTexts(data)
      .map(text => new BotTextMessage(text));
  }

  /**
   * Gets the texts used for building the BotTextMessages.
   * @param {Object} data - data used at display time
   * @returns {String[]} an array of strings
   */
  getTexts(data) {
    logger.debug('getTexts', data);
    return [];
  }
}

module.exports = TextView;
