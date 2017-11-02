const logger = require('logtown')('QnasView');
const { ActionsMessage, BotTextMessage, Postback } = require('../messages');

/**
 * Qnas view
 */
class QnasView {
  /**
   * Render an array of bot messages
   * @param {String} botId - the bot id
   * @param {String} userId - the user id
   * @param {String} key - the dialog key
   * @param {Object} parameters - the dialog parameters
   * @returns {Object[]} the bot messages
   */
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

  /**
   * Render a qna answer
   * @param {String} botId - the bot id
   * @param {String} userId - the user id
   * @param {String} answer - the answer
   * @returns {BotTextMessage[]} the answer
   */
  renderAnswer(botId, userId, answer) {
    logger.debug('renderAnswer', botId, userId, answer);
    return [
      new BotTextMessage(botId, userId, answer),
    ];
  }

  /**
   * Render qna questions
   * @param {String} botId - the bot id
   * @param {String} userId - the user id
   * @param {Object[]} qnas - the qnas
   * @returns {Object[]} the questions
   */
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
