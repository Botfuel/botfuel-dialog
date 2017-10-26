const { BotTextMessage } = require('../messages');
const TextView = require('./text_view');

class DefaultView extends TextView {
  getTexts() {
    return ['Not understood.'];
  }
}

module.exports = DefaultView;
