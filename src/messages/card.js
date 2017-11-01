/**
 * Card
 * @class
 * @classdesc a card message, this message is very specific to messenger
 * @param {string} title - the card title
 * @param {string} imageUrl - the card image url
 * @param {object[]} buttons - an array of actions buttons
 */
class Card {
  // TODO : this is very Messenger specific, let's generalize it!
  constructor(title, imageUrl, buttons) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.buttons = buttons.map(button => button.toJson());
  }

  /**
   * Convert the card to json
   * @return {object} the json card
   */
  toJson() {
    return {
      title: this.title,
      image_url: this.imageUrl,
      buttons: this.buttons,
    };
  }
}

module.exports = Card;
