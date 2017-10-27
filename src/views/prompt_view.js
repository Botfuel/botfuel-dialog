const logger = require('logtown')('PromptView');
const { BotTextMessage } = require('../messages');

class PromptView {
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

  renderAsk(botId, userId) {
    return [
      new BotTextMessage(botId, userId, 'continue dialog?'),
    ];
  }

  renderConfirm(botId, userId) {
    return [
      new BotTextMessage(botId, userId, 'dialog confirmed.'),
    ];
  }

  renderDiscard(botId, userId) {
    return [
      new BotTextMessage(botId, userId, 'dialog discarded.'),
    ];
  }

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
