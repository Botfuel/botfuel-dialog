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
  async execute(id, responses, messageEntities, age) {
    console.log('QnasDialog.execute', id, responses, messageEntities, age);
    const qnas = messageEntities[0].value;
    console.log('QnasDialog.execute: qnas', qnas);
    if (qnas.length === 1) {
      this.textMessage(id, responses, this.parameters.template, { answer: qnas[0].answer });
    } else {
      const buttons = qnas.map(qna => this.questionButton(qna.questions[0], qna.answer));
      await this.textMessage(id, responses, 'qnas_header');
      await this.actionsMessage(id, responses, buttons);
    }
    return true;
  }
}

module.exports = QnasDialog;
