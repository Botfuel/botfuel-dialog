const logger = require('logtown')('DefaultView.en');
const TextView = require('./text_view');

/**
 * Default EN text view
 * @extends TextView
 */
class DefaultView extends TextView {
  /**
   * Get views texts
   * @override
   * @param {object} [parameters={}] - the dialog parameters
   * @return {string[]}
   */
  getTexts(parameters = {}) {
    logger.debug('getTexts', parameters);
    return ['Not understood.'];
  }
}

module.exports = DefaultView;
