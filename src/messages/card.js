/**
 * Card message type
 */
class Card {
  /**
   * @constructor
   * @param {String} title - the card title
   * @param {String} imageUrl - the card image url
   * @param {Object[]} buttons - an array of actions buttons
   */
  constructor(title, imageUrl, buttons) {
    // TODO : this is very Messenger specific, let's generalize it!
    this.title = title;
    this.imageUrl = imageUrl;
    this.buttons = buttons;
  }

  /**
   * Converts the card to json
   * @returns {Object} the json card
   */
  toJson() {
    return {
      title: this.title,
      image_url: this.imageUrl,
      buttons: this.buttons.map(button => button.toJson()),
    };
  }
}

module.exports = Card;
