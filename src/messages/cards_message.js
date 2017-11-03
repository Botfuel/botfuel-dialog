const Message = require('./message');

/**
 * Cards message
 * @extends Message
 */
class CardsMessage extends Message {
  /**
   * @constructor
   * @param {Object[]} cards - the cards array
   * @param {Object} [options] - the optional message options
   */
  constructor(cards, options) {
    super('cards', 'bot', cards, options);
  }

  /**
   * Renders json cards
   * @returns {Object[]} the json cards
   */
  valueAsJson() {
    return this.value.map(card => card.toJson());
  }
}

module.exports = CardsMessage;
