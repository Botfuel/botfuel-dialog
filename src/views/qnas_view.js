const logger = require('logtown')('QnasView');
const { ActionsMessage, BotTextMessage, Postback } = require('../messages');

/**
 * Qnas view
 */
class QnasView {
  /**
   * Render an array of bot messages
   * @param {String} userId - the user id
   * @param {String} key - the dialog key
   * @param {Object} parameters - the dialog parameters
   * @returns {Object[]} the bot messages
   */
  render(userId, key, parameters) {
    logger.debug('render', userId, key, parameters);
    switch (key) {
      case 'answer':
        return this.renderAnswer(userId, parameters.answer);
      case 'questions':
        return this.renderQuestions(userId, parameters.qnas);
      default:
        return null;
    }
  }

  /**
   * Render a qna answer
   * @param {String} userId - the user id
   * @param {String} answer - the answer
   * @returns {BotTextMessage[]} the answer
   */
  renderAnswer(userId, answer) {
    logger.debug('renderAnswer', userId, answer);
    return [
      new BotTextMessage(userId, answer),
    ];
  }

  /**
   * Render qna questions
   * @param {String} userId - the user id
   * @param {Object[]} qnas - the qnas
   * @returns {Object[]} the questions
   */
  renderQuestions(userId, qnas) {
    logger.debug('renderQuestions', userId, qnas);
    const postbacks = qnas.map(qna => new Postback(
      qna.questions[0],
      'qnas_dialog',
      [{
        dim: 'qnas',
        value: [{ answer: qna.answer }],
      }],
    ));
    return [
      new BotTextMessage(userId, 'What do you mean?'),
      new ActionsMessage(userId, postbacks),
    ];
  }
}

module.exports = QnasView;
