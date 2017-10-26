const { BotTextMessage } = require('../messages');
const TextView = require('./text_view');

class QnasHeaderView extends TextView {
  getText(botId, userId) {
    return new BotTextMessage(botId, userId, 'Que voulez vous dire?');
  }
}

module.exports = QnasHeaderView;
