const logger = require('logtown')('PromptView');
const { BotTextMessage } = require('../messages');
const View = require('./view');

/**
 * Prompt dialog's view.
 * @extends View
 */
class PromptView extends View {
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
   * Asks for confirmation.
   * @private
   * @returns {Object[]} the bot messages
   */
  renderAsk() {
    return [
      new BotTextMessage('continue dialog?'),
    ];
  }

  /**
   * Confirms the dialog.
   * @private
   * @returns {Object[]} the bot messages
   */
  renderConfirm() {
    return [
      new BotTextMessage('dialog confirmed.'),
    ];
  }

  /**
   * Discards the dialog.
   * @private
   * @returns {Object[]} the bot messages
   */
  renderDiscard() {
    return [
      new BotTextMessage('dialog discarded.'),
    ];
  }

  /**
   * Confirms the defined entities and asks for the needed ones.
   * @private
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
      messages.push(new BotTextMessage(`Entities needed: ${missingEntities.join(', ')}`));
      messages.push(new BotTextMessage(`Which ${missingEntities[0]}?`));
    }
    return messages;
  }
}

module.exports = PromptView;
