const { PromptView, BotTextMessage } = require('botfuel-dialog');

class CancelView extends PromptView {
  renderEntities(matchedEntities) {
    const answer = matchedEntities.boolean && matchedEntities.boolean.values[0].value;

    if (answer === true) {
      return [new BotTextMessage('Dialog canceled!')];
    }

    if (answer === false) {
      return [new BotTextMessage('Resuming dialog...')];
    }

    return [new BotTextMessage('Are you sure you want to cancel?')];
  }
}

module.exports = CancelView;
