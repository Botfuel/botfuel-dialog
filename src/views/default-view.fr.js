const logger = require('logtown')('DefaultView.fr');
const TextView = require('./text_view');

/**
 * Default text view for french.
 * @extends TextView
 */
class DefaultView extends TextView {
  // eslint-disable-next-line require-jsdoc
  getTexts(data) {
    logger.debug('getTexts', data);
    return ['Je n\'ai pas compris.'];
  }
}

module.exports = DefaultView;
