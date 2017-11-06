const logger = require('logtown')('DefaultView.fr');
const TextView = require('./text_view');

/**
 * Default text view for french.
 * @extends TextView
 */
class DefaultView extends TextView {
  getTexts(parameters = {}) {
    logger.debug('getTexts', parameters);
    return ['Je n\'ai pas compris.'];
  }
}

module.exports = DefaultView;
