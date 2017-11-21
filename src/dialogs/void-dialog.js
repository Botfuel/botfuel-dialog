const logger = require('logtown')('VoidDialog');
const Dialog = require('./dialog');

/**
 * The void dialog does nothing.
 *
 * It is used for testing purposes.
 * @extends Dialog
 */
class VoidDialog extends Dialog {
  // eslint-disable-next-line require-jsdoc
  async execute(adapter, userId, messageEntities) {
    logger.debug('execute', userId, messageEntities);
    return { status: this.STATUS_COMPLETED };
  }
}

module.exports = VoidDialog;
