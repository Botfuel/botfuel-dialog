const _ = require('lodash');
const BotTextMessage = require('./parts/bot_text_message');

class PromptView {
  render(botId, userId, key, parameters) {
    console.log('PromptView.render', botId, userId, key, parameters);
    let botMessages;
    switch (key) {
      case 'ask':
        botMessages = this.ask(botId, userId);
        break;
      case 'confirm':
        botMessages = this.confirm(botId, userId);
        break;
      case 'discard':
        botMessages = this.discard(botId, userId);
        break;
      case 'entities_ask':
        botMessages = this.entitiesAsk(botId, userId, parameters);
        break;
      case 'entities_confirm':
        botMessages = this.entitiesConfirm(botId, userId, parameters);
        break;
      case 'entity_ask':
        botMessages = this.entityAsk(botId, userId, parameters);
        break;
      case 'entity_confirm':
        botMessages = this.entityConfirm(botId, userId, parameters);
        break;
      default:
        botMessages = [];
    }
    return _.isArray(botMessages) ? botMessages : [botMessages];
  }

  ask(botId, userId) {
    return new BotTextMessage(botId, userId, 'continue dialog?');
  }

  confirm(botId, userId) {
    return new BotTextMessage(botId, userId, 'dialog confirmed.');
  }

  discard(botId, userId) {
    return new BotTextMessage(botId, userId, 'dialog discarded.');
  }

  entitiesAsk(botId, userId, parameters) {
    return new BotTextMessage(botId, userId, `Which ${this.concatEntities(parameters.entities)}?`);
  }

  entitiesConfirm(botId, userId, parameters) {
    return new BotTextMessage(botId, userId, `You want ${this.concatEntitiesValues(parameters.entities)} for the dialog.`);
  }

  entityAsk(botId, userId, parameters) {
    return new BotTextMessage(botId, userId, `Which ${parameters.entity}?`);
  }

  entityConfirm(botId, userId, parameters) {
    return new BotTextMessage(botId, userId, `The ${parameters.entity.dim} is ${parameters.entity.body}.`);
  }

  concatEntities(entities) {
    console.log('PromptView.concatEntities', entities);
    let result = '';
    entities.forEach((e) => {
      if (entities.length === 1 || entities.indexOf(e) === entities.length - 2) {
        result += `${e}`;
      } else if (entities.indexOf(e) === entities.length - 1) {
        result += ` and ${e}`;
      } else {
        result += `${e}, `;
      }
    });
    return result;
  }

  concatEntitiesValues(entities) {
    console.log('PromptView.concatEntitiesValues', entities);
    let result = '';
    let value;
    entities.forEach((e) => {
      value = e.body || e.values[0].value;
      if (entities.length === 1 || entities.indexOf(e) === entities.length - 2) {
        result += `${value}`;
      } else if (entities.indexOf(e) === entities.length - 1) {
        result += ` and ${value}`;
      } else {
        result += `${value}, `;
      }
    });
    return result;
  }
}

module.exports = PromptView;
