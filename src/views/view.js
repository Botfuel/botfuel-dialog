const logger = require('logtown')('View');

/**
 * View.
 */
class View {
  renderAsJson(botId, userId, key, parameters) {
    return this.render(key, parameters).map(msg => msg.toJson(botId, userId));
  }
}

module.exports = View;
