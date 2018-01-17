const { PromptView, BotTextMessage } = require('botfuel-dialog');

class CitiesView extends PromptView {
  renderEntities(matchedEntities, missingEntities) {
    const messages = [];

    if (matchedEntities.favoriteCities && matchedEntities.favoriteCities.length) {
      const cityNames = matchedEntities.favoriteCities.map(entity => entity.values[0].value);
      messages.push(new BotTextMessage(`Cool, so you like ${cityNames.join(', ')}`));
    }

    if (missingEntities.favoriteCities) {
      const missingCount = 5 - matchedEntities.favoriteCities.length;
      messages.push(new BotTextMessage(`Can you give me ${missingCount} more cities you like?`));
    }

    return messages;
  }
}

module.exports = CitiesView;
