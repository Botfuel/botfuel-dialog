const logger = require('logtown')('QnasView');
const { ActionsMessage, BotTextMessage, Postback } = require('../messages');
const View = require('./view');

/**
 * Qnas dialog's view.
 * @extends View
 */
class QnasView extends View {
  render(key, parameters) {
    logger.debug('render', key, parameters);
    switch (key) {
      case 'answer':
        return this.renderAnswer(parameters.answer);
      case 'questions':
        return this.renderQuestions(parameters.qnas);
      default:
        return null;
    }
  }

  /**
   * Renders an answer.
   * @private
   * @param {String} answer - the answer
   * @returns {BotTextMessage[]} the answer as a text message
   */
  renderAnswer(answer) {
    logger.debug('renderAnswer', answer);
    return [
      new BotTextMessage(answer),
    ];
  }

  /**
   * Renders the questions.
   * @private
   * @param {Object[]} qnas - the qnas
   * @returns {Object[]} the questions as messages
   */
  renderQuestions(qnas) {
    logger.debug('renderQuestions', qnas);
    const postbacks = qnas.map(qna => new Postback(
      qna.questions[0],
      'qnas_dialog',
      [{
        dim: 'qnas',
        value: [{ answer: qna.answer }],
      }],
    ));
    return [
      new BotTextMessage('What do you mean?'),
      new ActionsMessage(postbacks),
    ];
  }
}

module.exports = QnasView;
