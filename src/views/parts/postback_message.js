const Message = require('./message');

class PostbackMessage extends Message {
  constructor(bot, user, dialogLabel, entities) {
    super('postback', 'user', bot, user, {
      dialog: { label: dialogLabel },
      entities,
    });
  }
}

module.exports = PostbackMessage;
