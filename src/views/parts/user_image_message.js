const Message = require('./message');

class UserImageMessage extends Message {
  constructor(bot, user, value) {
    super('image', 'user', bot, user, value);
  }
}

module.exports = UserImageMessage;
