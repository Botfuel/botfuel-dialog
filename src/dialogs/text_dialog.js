const Dialog = require('./dialog');

const logger = require('logtown').getLogger('TextDialog');

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
