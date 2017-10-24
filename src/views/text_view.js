const BotTextMessage = require('./parts/bot_text_message');

class TextView {
  render(botId, userId, parameters) {
    console.log('TextView.render');
    return new BotTextMessage(botId, userId, this.getText(parameters)).toJson();
  }

  getText() {
    return 'TextView text message';
  }
}

module.exports = TextView;
