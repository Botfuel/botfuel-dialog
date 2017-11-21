const logger = require('logtown')('View');
const { MissingImplementationError } = require('../errors');

/**
 * Generic view, to be subclassed.
 */
class View {
  /**
   * Renders a view as an array of json objects.
   * @param {String} botId - the bot id
   * @param {String} userId - the user id
   * @param {String} key - the view key
   * @param {Object} [data] - data used at display time
   * @returns {Object[]} the messages as an array json objects
   */
  renderAsJson(botId, userId, key, data) {
    logger.debug('renderAsJson', botId, userId, key, data);
    return this.render(key, data).map(msg => msg.toJson(botId, userId));
  }

  /**
   * Renders a view as an array of bot messages.
   * @param {String} key - the view key
   * @param {Object} [data] - data used at display time
   * @returns {Object[]} an array of bot messages
   */
  render(key, data) {
    logger.debug('render', key, data);
    throw new MissingImplementationError();
  }
}

module.exports = View;
