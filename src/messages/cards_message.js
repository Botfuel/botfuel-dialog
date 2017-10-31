const Message = require('./message');

/**
 * CardsMessage
 * @class
 * @classdesc a carousel message
 * @extends Message
 * @param {string|number} botId - the bot id
 * @param {string|number} userId - the user id
 * @param {object[]} actions - the actions array
 * @param {object} options - the message options
 */
class CardsMessage extends Message {
  constructor(botId, userId, cards, options) {
    super('cards', 'bot', botId, userId, cards.map(card => card.toJson()), options);
  }
}

module.exports = CardsMessage;
