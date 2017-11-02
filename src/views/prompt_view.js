const logger = require('logtown')('PromptView');
const { BotTextMessage } = require('../messages');

/**
 * Prompt view
 */
class PromptView {
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
      case 'ask':
        return this.renderAsk(userId);
      case 'confirm':
        return this.renderConfirm(userId);
      case 'discard':
        return this.renderDiscard(userId);
      case 'entities': {
        const { messageEntities, missingEntities } = parameters;
        return this.renderEntities(userId, messageEntities, missingEntities);
      }
      default:
        return null;
    }
  }

  /**
   * Render ask key
   * @param {String} userId - the user id
   * @returns {Object[]} the bot messages
   */
  renderAsk(userId) {
    return [
      new BotTextMessage(userId, 'continue dialog?'),
    ];
  }

  /**
   * Render confirm key
   * @param {String} userId - the user id
   * @returns {Object[]} the bot messages
   */
  renderConfirm(userId) {
    return [
      new BotTextMessage(userId, 'dialog confirmed.'),
    ];
  }

  /**
   * Render discard key
   * @param {String} userId - the user id
   * @returns {Object[]} the bot messages
   */
  renderDiscard(userId) {
    return [
      new BotTextMessage(userId, 'dialog discarded.'),
    ];
  }

  /**
   * Render entities key
   * @param {String} userId - the user id
   * @param {Object[]} messageEntities - the defined entities
   * @param {String[]} missingEntities - the needed entities
   * @returns {Object[]} the bot messages
   */
  renderEntities(userId, messageEntities, missingEntities) {
    const messages = [];
    if (messageEntities.length !== 0) {
      messages.push(new BotTextMessage(
        userId,
        `Entities defined: ${messageEntities.map(entity => entity.body).join(', ')}`,
      ));
    }
    if (missingEntities.length !== 0) {
      messages.push(new BotTextMessage(
        userId,
        `Entities needed: ${missingEntities.join(', ')}`,
      ));
      messages.push(new BotTextMessage(
        userId,
        `Which ${missingEntities[0]}?`,
      ));
    }
    return messages;
  }
}

module.exports = PromptView;
