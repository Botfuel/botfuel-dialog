const { BotTextMessage } = require('../messages');
const TextView = require('./text_view');

class DefaultView extends TextView {
  getText(botId, userId) {
    return new BotTextMessage(botId, userId, 'Je n\'ai pas compris.');
  }
}

module.exports = DefaultView;
