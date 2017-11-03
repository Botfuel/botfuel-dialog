const logger = require('logtown')('DefaultView.en');
const TextView = require('./text_view');

/**
 * Default EN text view
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
    return ['Not understood.'];
  }
}

module.exports = DefaultView;
