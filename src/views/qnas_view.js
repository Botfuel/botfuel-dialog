const { ActionsMessage, BotTextMessage } = require('../messages');

class QnasView {
  render(botId, userId, key, parameters) {
    console.log('QnasView.render', botId, userId, key, parameters);
    switch (key) {
      case 'answer':
        return this.renderAnswer(botId, userId, parameters.answer);
      case 'question':
        return this.renderQuestions(botId, userId, parameters.qnas);
      default:
        return null;
    }
  }

  renderAnswer(botId, userId, answer) {
    return [
      new BotTextMessage(botId, userId, answer),
    ];
  }

  renderQuestions(botId, userId, qnas) {
    const postbacks = qnas.map(qna => new Postback(
      qna.questions[0],
      'qnas_dialog',
      [{
        dim: 'qnas',
        value: [{ answer: qna.answer }],
      }],
    ));
    return [
      new BotTextMessage(botId, userId, 'What do you mean?'),
      new ActionsMessage(botId, user, postbacks),
    ];
  }
}

module.exports = QnasView;
