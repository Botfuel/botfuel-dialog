const logger = require('logtown')('PromptView');
const { BotTextMessage } = require('../messages');
const View = require('./view');

/**
 * Prompt view
 */
class PromptView extends View {
  /**
   * Render an array of bot messages
   * @param {String} key - the dialog key
   * @param {Object} parameters - the dialog parameters
   * @returns {Object[]} the bot messages
   */
  render(key, parameters) {
    logger.debug('render', key, parameters);
    switch (key) {
      case 'ask':
        return this.renderAsk();
      case 'confirm':
        return this.renderConfirm();
      case 'discard':
        return this.renderDiscard();
      case 'entities': {
        const { messageEntities, missingEntities } = parameters;
        return this.renderEntities(messageEntities, missingEntities);
      }
      default:
        return null;
    }
  }

  /**
   * Render ask key
   * @returns {Object[]} the bot messages
   */
  renderAsk() {
    return [
      new BotTextMessage('continue dialog?'),
    ];
  }

  /**
   * Render confirm key
   * @returns {Object[]} the bot messages
   */
  renderConfirm() {
    return [
      new BotTextMessage('dialog confirmed.'),
    ];
  }

  /**
   * Render discard key
   * @returns {Object[]} the bot messages
   */
  renderDiscard(d) {
    return [
      new BotTextMessage('dialog discarded.'),
    ];
  }

  /**
   * Render entities key
   * @param {Object[]} messageEntities - the defined entities
   * @param {String[]} missingEntities - the needed entities
   * @returns {Object[]} the bot messages
   */
  renderEntities(messageEntities, missingEntities) {
    const messages = [];
    if (messageEntities.length !== 0) {
      messages.push(new BotTextMessage(
        `Entities defined: ${messageEntities.map(entity => entity.body).join(', ')}`,
      ));
    }
    if (missingEntities.length !== 0) {
      messages.push(new BotTextMessage(
        `Entities needed: ${missingEntities.join(', ')}`,
      ));
      messages.push(new BotTextMessage(
        `Which ${missingEntities[0]}?`,
      ));
    }
    return messages;
  }
}

module.exports = PromptView;
