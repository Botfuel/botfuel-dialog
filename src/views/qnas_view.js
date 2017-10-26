const TextView = require('./text_view');
const BotTextMessage = require('./parts/bot_text_message');

class QnasView extends TextView {
  getText(botId, userId, parameters) {
    return new BotTextMessage(botId, userId, parameters.answer);
  }
}

module.exports = QnasView;
