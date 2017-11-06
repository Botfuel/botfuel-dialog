const logger = require('logtown')('QnasDialog');
const Dialog = require('./dialog');

/**
 * The qnas dialog is used to wrap botfuel QnA's
 * @extends Dialog
 */
class QnasDialog extends Dialog {
  /**
   * @constructor
   * @param {Object} config - the bot config
   * @param {class} brain - the bot brain
   */
  constructor(config, brain) {
    super(config, brain, 2);
  }

  /**
   * Executes the dialog.
   * @async
   * @param {Adapter} adapter - the adapter
   * @param {String} userId the user id
   * @param {Object[]} messageEntities - the message entities
   * @returns {String} the dialog completed status
   */
  async execute(adapter, userId, messageEntities) {
    logger.debug('execute', userId, messageEntities);
    if (messageEntities.length === 0) {
      await this.display(adapter, userId, 'default_dialog');
    } else {
      const qnas = messageEntities[0].value;
      logger.debug('execute: qnas', qnas);
      if (qnas.length === 1) {
        await this.display(adapter, userId, 'answer', { answer: qnas[0].answer });
      } else {
        await this.display(adapter, userId, 'questions', { qnas });
      }
    }
    return Dialog.STATUS_COMPLETED;
  }
}

module.exports = QnasDialog;
