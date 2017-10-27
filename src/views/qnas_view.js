const logger = require('logtown').getLogger('QnasView');
const { ActionsMessage, BotTextMessage, Postback } = require('../messages');

class QnasView {
  render(botId, userId, key, parameters) {
    logger.debug('render', botId, userId, key, parameters);
    switch (key) {
      case 'answer':
        return this.renderAnswer(botId, userId, parameters.answer);
      case 'questions':
        return this.renderQuestions(botId, userId, parameters.qnas);
      default:
        return null;
    }
  }

  renderAnswer(botId, userId, answer) {
    logger.debug('renderAnswer', botId, userId, answer);
    return [
      new BotTextMessage(botId, userId, answer),
    ];
  }

  renderQuestions(botId, userId, qnas) {
    logger.debug('renderQuestions', botId, userId, qnas);
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
      new ActionsMessage(botId, userId, postbacks),
    ];
  }
}

module.exports = QnasView;
