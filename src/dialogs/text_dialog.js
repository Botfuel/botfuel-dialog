const logger = require('logtown')('TextDialog');
const Dialog = require('./dialog');

/**
 * The text dialog is used to display text messages.
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
   * @returns {String} the new dialog status
   */
  async execute(adapter, userId, messageEntities) {
    logger.debug('execute', userId, messageEntities);
    const data = await this.getViewData(userId, messageEntities);
    await this.display(adapter, userId, null, data);
    logger.error('execute: AFTER DISPLAY');
    return this.STATUS_COMPLETED;
  }

  /**
   * Returns optional data used to generate the view.
   * @param {String} userId - the user id
   * @param {Object[]} messageEntities - the message entities
   * @returns {Object} the data
   */
  async getViewData(userId, messageEntities) {
    logger.debug('getViewData', userId, messageEntities);
    return null;
  }
}

module.exports = TextDialog;
