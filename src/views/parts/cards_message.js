const Message = require('./message');

class CardsMessage extends Message {
  constructor(bot, user, cards, options) {
    super('actions', 'bot', bot, user, cards, options);
  }
}

module.exports = CardsMessage;
