const Message = require('./message');

class CardsMessage extends Message {
  constructor(bot, user, cards, options) {
    super('actions', 'bot', bot, user, cards.map(card => card.toJson()), options);
  }
}

module.exports = CardsMessage;
