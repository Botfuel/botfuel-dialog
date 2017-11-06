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
    super(config, brain, 1); // TODO: this is a hack for avoiding recording this dialog in lastDialog
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
    const qnas = messageEntities[0].value;
    logger.debug('execute: qnas', qnas);
    if (qnas.length === 1) {
      await this.display(adapter, userId, 'answer', { answer: qnas[0].answer });
      return Dialog.STATUS_COMPLETED;
    } else {
      await this.display(adapter, userId, 'questions', { qnas });
      return Dialog.STATUS_READY;
    }
  }
}

module.exports = QnasDialog;
