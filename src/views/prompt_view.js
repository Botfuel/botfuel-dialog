const logger = require('logtown')('PromptView');
const { BotTextMessage } = require('../messages');

/**
 * Prompt view
 */
class PromptView {
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
      case 'ask':
        return this.renderAsk(botId, userId);
      case 'confirm':
        return this.renderConfirm(botId, userId);
      case 'discard':
        return this.renderDiscard(botId, userId);
      case 'entities': {
        const { messageEntities, missingEntities } = parameters;
        return this.renderEntities(botId, userId, messageEntities, missingEntities);
      }
      default:
        return null;
    }
  }

  /**
   * Render ask key
   * @param {String} botId - the bot id
   * @param {String} userId - the user id
   * @returns {Object[]} the bot messages
   */
  renderAsk(botId, userId) {
    return [
      new BotTextMessage(botId, userId, 'continue dialog?'),
    ];
  }

  /**
   * Render confirm key
   * @param {String} botId - the bot id
   * @param {String} userId - the user id
   * @returns {Object[]} the bot messages
   */
  renderConfirm(botId, userId) {
    return [
      new BotTextMessage(botId, userId, 'dialog confirmed.'),
    ];
  }

  /**
   * Render discard key
   * @param {String} botId - the bot id
   * @param {String} userId - the user id
   * @returns {Object[]} the bot messages
   */
  renderDiscard(botId, userId) {
    return [
      new BotTextMessage(botId, userId, 'dialog discarded.'),
    ];
  }

  /**
   * Render entities key
   * @param {String} botId - the bot id
   * @param {String} userId - the user id
   * @param {Object[]} messageEntities - the defined entities
   * @param {String[]} missingEntities - the needed entities
   * @returns {Object[]} the bot messages
   */
  renderEntities(botId, userId, messageEntities, missingEntities) {
    const messages = [];
    if (messageEntities.length !== 0) {
      messages.push(new BotTextMessage(
        botId,
        userId,
        `Entities defined: ${messageEntities.map(entity => entity.body).join(', ')}`,
      ));
    }
    if (missingEntities.length !== 0) {
      messages.push(new BotTextMessage(
        botId,
        userId,
        `Entities needed: ${missingEntities.join(', ')}`,
      ));
      messages.push(new BotTextMessage(
        botId,
        userId,
        `Which ${missingEntities[0]}?`,
      ));
    }
    return messages;
  }
}

module.exports = PromptView;
