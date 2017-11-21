const Message = require('./message');

/**
 * A message containing cards.
 * @extends Message
 */
class CardsMessage extends Message {
  /**
   * @constructor
   * @param {Object[]} cards - the cards array
   * @param {Object} [options] - the message options
   */
  constructor(cards, options) {
    super('cards', 'bot', cards, options);
  }

  // eslint-disable-next-line require-jsdoc
  valueAsJson() {
    return this.value.map(card => card.toJson());
  }
}

module.exports = CardsMessage;
