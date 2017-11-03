const logger = require('logtown')('DefaultView.fr');
const TextView = require('./text_view');

/**
 * Default FR text view
 * @extends TextView
 */
class DefaultView extends TextView {
  /**
   * Gets view texts
   * @override
   * @param {Object} [parameters={}] - the optional dialog parameters
   * @returns {String[]}
   */
  getTexts(parameters = {}) {
    logger.debug('getTexts', parameters);
    return ['Je n\'ai pas compris.'];
  }
}

module.exports = DefaultView;
