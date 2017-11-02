const logger = require('logtown')('TextView');
const { BotTextMessage } = require('../messages');

/**
 * Text view
 */
class TextView {
  /**
   * Renders an array of BotTextMessages
   * @param {String} botId - the bot id
   * @param {String} userId - the user id
   * @param {String} key - the dialog key
   * @param {Object} parameters - the dialog parameters
   * @returns {BotTextMessage[]} the array of bot text messages
   */
  render(botId, userId, key, parameters) {
    logger.debug('render', botId, userId, key, parameters);
    return this
      .getTexts(parameters)
      .map(text => new BotTextMessage(botId, userId, text));
  }

  /**
   * Gets views texts
   * @param {Object} [parameters={}] - the dialog parameters
   * @returns {String[]}
   */
  getTexts(parameters = {}) {
    logger.debug('getTexts', parameters);
    return [];
  }
}

module.exports = TextView;
