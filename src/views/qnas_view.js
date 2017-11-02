const logger = require('logtown')('QnasView');
const { ActionsMessage, BotTextMessage, Postback } = require('../messages');
const View = require('./view');

/**
 * Qnas view
 */
class QnasView extends View {
  /**
   * Render an array of bot messages
   * @param {String} key - the dialog key
   * @param {Object} parameters - the dialog parameters
   * @returns {Object[]} the bot messages
   */
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
   * Renders a qna answer
   * @param {String} answer - the answer
   * @returns {BotTextMessage[]} the answer
   */
  renderAnswer(answer) {
    logger.debug('renderAnswer', answer);
    return [
      new BotTextMessage(answer),
    ];
  }

  /**
   * Render qna questions
   * @param {Object[]} qnas - the qnas
   * @returns {Object[]} the questions
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
