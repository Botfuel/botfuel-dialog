const Message = require('./message');

class CardsMessage extends Message {
  constructor(bot, user, cards, options) {
    super('cards', 'bot', bot, user, cards.map(card => card.toJson()), options);
  }
}

module.exports = CardsMessage;
