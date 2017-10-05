const Dialog = require('./dialog');

class QnasDialog extends Dialog {
  constructor(config, brain) {
    super(config, brain);
    this.label = 'qnas';
    this.templatePath = `${__dirname}/../templates`;
  }

  questionButton(question, answer) {
    console.log('QnasDialog.questionButton', question, answer);
    return {
      type: 'postback',
      text: question,
      value: {
        dialog: { label: 'qnas' },
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
    console.log('QnasDialog.execute', responses, messageEntities);
    const qnas = messageEntities[0].value;
    console.log('QnasDialog.execute: qnas', qnas);
    if (qnas.length === 1) {
      this.textMessage(id, responses, this.label, { answer: qnas[0].answer });
    } else {
      const buttons = qnas.map(qna => this.questionButton(qna.questions[0], qna.answer));
      await this.textMessage(id, responses, 'qnas_header');
      await this.actionsMessage(id, responses, buttons);
    }
    return true;
  }
}

module.exports = QnasDialog;
