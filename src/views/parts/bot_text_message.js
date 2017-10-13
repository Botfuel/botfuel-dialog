const Message = require('./message');

class BotTextMessage extends Message {
  constructor(bot, user, value, options) {
    super('text', 'bot', bot, user, value, options);
  }
}

module.exports = BotTextMessage;
