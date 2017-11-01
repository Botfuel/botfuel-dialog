const logger = require('logtown')('PromptView');
const { BotTextMessage } = require('../messages');

/**
 * Prompt view
 */
class PromptView {
  /**
   * Render an array of bot messages
   * @param {string} botId - the bot id
   * @param {string} userId - the user id
   * @param {string} key - the dialog key
   * @param {object} parameters - the dialog parameters
   * @return {object[]} the bot messages
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
   * @param {string} botId - the bot id
   * @param {string} userId - the user id
   * @return {object[]} the bot messages
   */
  renderAsk(botId, userId) {
    return [
      new BotTextMessage(botId, userId, 'continue dialog?'),
    ];
  }

  /**
   * Render confirm key
   * @param {string} botId - the bot id
   * @param {string} userId - the user id
   * @return {object[]} the bot messages
   */
  renderConfirm(botId, userId) {
    return [
      new BotTextMessage(botId, userId, 'dialog confirmed.'),
    ];
  }

  /**
   * Render discard key
   * @param {string} botId - the bot id
   * @param {string} userId - the user id
   * @return {object[]} the bot messages
   */
  renderDiscard(botId, userId) {
    return [
      new BotTextMessage(botId, userId, 'dialog discarded.'),
    ];
  }

  /**
   * Render entities key
   * @param {string} botId - the bot id
   * @param {string} userId - the user id
   * @param {object[]} messageEntities - the defined entities
   * @param {string[]} missingEntities - the needed entities
   * @return {object[]} the bot messages
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
