const Message = require('./message');

/**
 * Cards message
 * @extends Message
 */
class CardsMessage extends Message {
  /**
   * @constructor
   * @param {string} botId - the bot id
   * @param {string} userId - the user id
   * @param {object[]} cards - the cards array
   * @param {object} options - the message options
   */
  constructor(botId, userId, cards, options) {
    super('cards', 'bot', botId, userId, cards.map(card => card.toJson()), options);
  }
}

module.exports = CardsMessage;
