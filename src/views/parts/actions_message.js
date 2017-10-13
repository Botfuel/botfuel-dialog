const Message = require('./message');

class ActionsMessage extends Message {
  constructor(bot, user, actions, options) {
    super('actions', 'bot', bot, user, actions, options);
  }
}

module.exports = ActionsMessage;
