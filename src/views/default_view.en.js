const TextView = require('./text_view');
const BotTextMessage = require('./parts/bot_text_message');

class DefaultView extends TextView {
  getText(botId, userId) {
    return new BotTextMessage(botId, userId, 'Not understood.');
  }
}

module.exports = DefaultView;
