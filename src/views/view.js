const logger = require('logtown')('View');

/**
 * Generic view, to be subclassed.
 */
class View {
  /**
   * Renders a view as an array of json objects.
   * @param {String} botId - the bot id
   * @param {String} userId - the user id
   * @param {String} key - the view key
   * @param {Object} [parameters] - optional view parameters
   * @returns {Object[]} the messages as an array json objects
   */
  renderAsJson(botId, userId, key, parameters) {
    logger.debug('renderAsJson', botId, userId, key, parameters);
    return this.render(key, parameters).map(msg => msg.toJson(botId, userId));
  }

  /**
   * Renders a view as an array of bot messages.
   * @param {String} key - the view key
   * @param {Object} [parameters] - optional view parameters
   * @returns {Object[]} an array of bot messages
   */
  render(key, parameters) {
    logger.debug('render', key, parameters);
    throw new Error('Not implemented!');
  }
}

module.exports = View;
