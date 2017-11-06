const logger = require('logtown')('DefaultView.en');
const TextView = require('./text_view');

/**
 * Default text view for english.
 * @extends TextView
 */
class DefaultView extends TextView {
  getTexts(parameters = {}) {
    logger.debug('getTexts', parameters);
    return ['Not understood.'];
  }
}

module.exports = DefaultView;
