const { BotTextMessage } = require('../messages');
const TextView = require('./text_view');

class QnasView extends TextView {
  getText(botId, userId, parameters) {
    return new BotTextMessage(botId, userId, parameters.answer);
  }
}

module.exports = QnasView;
