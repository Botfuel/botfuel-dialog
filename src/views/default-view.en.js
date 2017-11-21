const logger = require('logtown')('DefaultView.en');
const TextView = require('./text-view');

/**
 * Default text view for english.
 * @extends TextView
 */
class DefaultView extends TextView {
  // eslint-disable-next-line require-jsdoc
  getTexts(data) {
    logger.debug('getTexts', data);
    return ['Not understood.'];
  }
}

module.exports = DefaultView;
