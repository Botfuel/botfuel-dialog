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
   * @param {String} userId the user id
   * @param {Object[]} responses - the bot responses
   * @param {Object[]} messageEntities - the message entities
   * @returns {String} the dialog completed status
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
