const Message = require('./message');

class UserTextMessage extends Message {
  constructor(bot, user, text, options) {
    super('text', 'user', bot, user, text, options);
  }
}

module.exports = UserTextMessage;
