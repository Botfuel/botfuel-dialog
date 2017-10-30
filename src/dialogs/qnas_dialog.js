const logger = require('logtown')('QnasDialog');
const Dialog = require('./dialog');

class QnasDialog extends Dialog {
  constructor(config, brain) {
    super(config, brain, 2);
  }

  /**
   * Executes.
   * @param {string} userId the user id
   * @param {Object[]} responses
   * @param {Object} messageEntities
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
