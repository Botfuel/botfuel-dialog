const logger = require('logtown')('QnasDialog');
const Dialog = require('./dialog');

/**
 * QnasDialog
 * @class
 * @classdesc the qnas dialog is used to wrap botfuel QnA's
 * @extends Dialog
 * @param {object} config - the bot config
 * @param {class} brain - the bot brain
 */
class QnasDialog extends Dialog {
  constructor(config, brain) {
    super(config, brain, 2);
  }

  /**
   * Executes the dialog.
   * @param {string} userId the user id
   * @param {object[]} responses
   * @param {object[]} messageEntities
   * @return {string} the dialog completed status
   */
  async execute(userId, responses, messageEntities) {
    logger.debug('execute', userId, responses, messageEntities);
    // @TODO add messageEntities validation here to prevent undefined messageEntities[0]
    const qnas = messageEntities[0].value;
    logger.debug('execute: qnas', qnas);
    if (qnas.length === 1) {
      this.display(userId, responses, 'answer', { answer: qnas[0].answer });
    } else {
      this.display(userId, responses, 'questions', { qnas });
    }
    return Dialog.STATUS_COMPLETED;
  }
}

module.exports = QnasDialog;
