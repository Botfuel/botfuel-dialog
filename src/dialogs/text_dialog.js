const logger = require('logtown')('TextDialog');
const Dialog = require('./dialog');

/**
 * The text dialog is used to display a text message
 * @extends Dialog
 */
class TextDialog extends Dialog {
  /**
   * @constructor
   * @param {object} config - the bot config
   * @param {class} brain - the bot brain
   */
  constructor(config, brain) {
    super(config, brain, 1);
  }

  /**
   * Executes the dialog.
   * @async
   * @param {string} userId - the user id
   * @param {object[]} responses - the bot responses
   * @param {object[]} messageEntities - the message entities
   * @return {string} the dialog completed status
   */
  async execute(userId, responses, messageEntities) {
    logger.debug('execute', userId, responses, messageEntities);
    this.display(userId, responses, null, messageEntities);
    return Dialog.STATUS_COMPLETED;
  }
}

module.exports = TextDialog;
