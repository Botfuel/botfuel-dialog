const _ = require('lodash');
const BotTextMessage = require('./parts/bot_text_message');

class TextView {
  render(botId, userId, key, parameters) {
    console.log('TextView.render');
    const botMessages = this.getText(botId, userId, key, parameters);
    return _.isArray(botMessages) ? botMessages : [botMessages];
  }

  getText(botId, userId) {
    return new BotTextMessage(botId, userId, 'TextView text message');
  }
}

module.exports = TextView;
