const Message = require('./message');

class ActionsMessage extends Message {
  constructor(bot, user, actions, options) {
    super('actions', 'bot', bot, user, actions.map(action => action.toJson()), options);
  }
}

module.exports = ActionsMessage;
