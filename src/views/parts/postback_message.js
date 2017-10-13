const Message = require('./message');

class PostbackMessage extends Message {
  constructor(bot, user, value) {
    super('postback', 'user', bot, user, value);
  }
}

module.exports = PostbackMessage;
