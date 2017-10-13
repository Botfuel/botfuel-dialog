const ActionsMessage = require('../views/parts/actions_message');
const Postback = require('../views/parts/postback');
const Dialog = require('./dialog');

class QnasDialog extends Dialog {
  constructor(config, brain) {
    super(config, brain, { template: 'qnas' });
    this.templatePath = `${__dirname}/../views/templates`;
    this.maxComplexity = 2;
  }

  /**
   * Executes.
   * @param {string} id the user id
   * @param {} responses
   * @param {Object} messageEntities
   */
  async execute(id, responses, messageEntities) {
    console.log('QnasDialog.execute', id, responses, messageEntities);
    const qnas = messageEntities[0].value;
    console.log('QnasDialog.execute: qnas', qnas);
    if (qnas.length === 1) {
      this.pushMessages(responses, this.textMessages(id,
                                                     this.parameters.template,
                                                     { answer: qnas[0].answer }));
    } else {
      this.pushMessages(responses, this.textMessages(id, 'qnas_header'));
      const buttons = qnas.map(qna => new Postback(qna.questions[0], 'qnas_dialog', [{
        dim: 'qnas',
        value: [{ answer: qna.answer }],
      }]));
      this.pushMessage(responses, new ActionsMessage(this.config.id, id, buttons).toJson());
    }
    return true;
  }
}

module.exports = QnasDialog;
