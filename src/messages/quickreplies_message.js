const Message = require('./message');

class QuickrepliesMessage extends Message {
  constructor(bot, user, texts, options) {
    super('quickreplies', 'bot', bot, user, texts, options);
  }
}

module.exports = QuickrepliesMessage;
