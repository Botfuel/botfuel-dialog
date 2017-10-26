const TextView = require('./text_view');
const BotTextMessage = require('./parts/bot_text_message');

class QnasHeaderView extends TextView {
  getText(botId, userId) {
    return new BotTextMessage(botId, userId, 'Que voulez vous dire?');
  }
}

module.exports = QnasHeaderView;
