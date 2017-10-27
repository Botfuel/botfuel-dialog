const logger = require('logtown')('TextDialog');
const Dialog = require('./dialog');

/**
 * TextDialog class.
 */
class TextDialog extends Dialog {
  /**
   * Constructor.
   */
  constructor(config, brain) {
    super(config, brain, 1);
  }

  /**
   * Executes.
   * @param {string} userId the user id
   */
  async execute(userId, responses, messageEntities) {
    logger.debug('execute', userId, responses, messageEntities);
    this.display(userId, responses, null, messageEntities);
    return Dialog.STATUS_COMPLETED;
  }
}

module.exports = TextDialog;
