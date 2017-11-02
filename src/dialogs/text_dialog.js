const logger = require('logtown')('TextDialog');
const Dialog = require('./dialog');

/**
 * The text dialog is used to display a text message
 * @extends Dialog
 */
class TextDialog extends Dialog {
  /**
   * @constructor
   * @param {Object} config - the bot config
   * @param {class} brain - the bot brain
   */
  constructor(config, brain) {
    super(config, brain, 1);
  }

  /**
   * Executes the dialog.
   * @async
   * @param {Adapter} adapter - the adapter
   * @param {String} userId - the user id
   * @param {Object[]} messageEntities - the message entities
   * @returns {String} the dialog completed status
   */
  async execute(adapter, userId, messageEntities) {
    logger.debug('execute', userId, messageEntities);
    this.display(adapter, userId, null, messageEntities);
    return Dialog.STATUS_COMPLETED;
  }
}

module.exports = TextDialog;
