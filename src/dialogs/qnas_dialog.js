const Messages = require('../messages');
const Dialog = require('./dialog');

class QnasDialog extends Dialog {
  constructor(config, brain) {
    super(config, brain, { template: 'qnas' });
    this.templatePath = `${__dirname}/../templates`;
    this.maxComplexity = 2;
  }

  questionButton(question, answer) {
    console.log('QnasDialog.questionButton', question, answer);
    return {
      type: 'postback',
      text: question,
      value: {
        dialog: { label: 'qnas_dialog' },
        entities: [{ dim: 'qnas', value: [{ answer }] }],
      },
    };
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
      const buttons = qnas.map(qna => this.questionButton(qna.questions[0], qna.answer));
      this.pushMessage(responses, Messages.botActions(this.config.id, id, buttons));
    }
    return true;
  }
}

module.exports = QnasDialog;
