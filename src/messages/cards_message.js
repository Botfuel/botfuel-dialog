const Message = require('./message');

/**
 * Cards message
 * @extends Message
 */
class CardsMessage extends Message {
  /**
   * @constructor
   * @param {String} botId - the bot id
   * @param {String} userId - the user id
   * @param {Object[]} cards - the cards array
   * @param {Object} options - the message options
   */
  constructor(botId, userId, cards, options) {
    super('cards', 'bot', botId, userId, cards.map(card => card.toJson()), options);
  }
}

module.exports = CardsMessage;
