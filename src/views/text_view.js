const logger = require('logtown')('TextView');
const { BotTextMessage } = require('../messages');

/**
 * TextView
 * @class
 * @classdesc represent a text view
 */
class TextView {
  /**
   * Render an array of BotTextMessages
   * @param {string|number} botId - the bot id
   * @param {string|number} userId - the user id
   * @param {string} key - the dialog key
   * @param {object} parameters - the dialog parameters
   * @return {BotTextMessage[]} the array of bot text messages
   */
  render(botId, userId, key, parameters) {
    logger.debug('render', botId, userId, key, parameters);
    return this
      .getTexts(parameters)
      .map(text => new BotTextMessage(botId, userId, text));
  }

  /**
   * Get views texts
   * @return {string[]}
   * @param {object} [parameters={}] - the dialog parameters
   */
  getTexts(parameters = {}) {
    logger.debug('getTexts', parameters);
    return [];
  }
}

module.exports = TextView;
