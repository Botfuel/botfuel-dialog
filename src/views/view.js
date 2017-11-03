const logger = require('logtown')('View');

/**
 * View.
 */
class View {
  /**
   * Renders a view as json
   * @param {String} botId - the bot id
   * @param {String} userId - the user id
   * @param {String} key - the view key
   * @param {Object} [parameters] - the optional view parameters
   * @returns {Object[]} the json messages
   */
  renderAsJson(botId, userId, key, parameters) {
    logger.debug('renderAsJson', botId, userId, key, parameters);
    return this.render(key, parameters).map(msg => msg.toJson(botId, userId));
  }
}

module.exports = View;
