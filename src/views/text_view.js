const { BotTextMessage } = require('../messages');

class TextView {
  render(botId, userId, key, parameters) {
    return this
      .getTexts(parameters)
      .map(text => new BotTextMessage(botId, userId, text));
  }

  getTexts() {
    return [];
  }
}

module.exports = TextView;
