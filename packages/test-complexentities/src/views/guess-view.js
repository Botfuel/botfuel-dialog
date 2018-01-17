const { PromptView, BotTextMessage } = require('botfuel-dialog');

class GuessView extends PromptView {
  renderEntities(matchedEntities, missingEntities) {
    if (missingEntities.favoriteColor) {
      return [new BotTextMessage('Nope! Guess again.')];
    }

    return [new BotTextMessage('Congratulations! My favorite color is red.')];
  }
}

module.exports = GuessView;
