const Message = require('./message');

class PostbackMessage extends Message {
  constructor(bot, user, dialog, entities) {
    super('postback', 'user', bot, user, { dialog, entities });
  }
}

module.exports = PostbackMessage;
