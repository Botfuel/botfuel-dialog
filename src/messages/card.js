const Part = require('./part');

/**
 * A card part.
 */
class Card extends Part {
  /**
   * @constructor
   * @param {String} title - the title
   * @param {String} imageUrl - the image url
   * @param {Object[]} buttons - an array of buttons
   */
  constructor(title, imageUrl, buttons) {
    super();
    // TODO : this is very Messenger specific, let's generalize it!
    this.title = title;
    this.imageUrl = imageUrl;
    this.buttons = buttons;
  }

  // eslint-disable-next-line require-jsdoc
  toJson() {
    return {
      title: this.title,
      image_url: this.imageUrl,
      buttons: this.buttons.map(button => button.toJson()),
    };
  }
}

module.exports = Card;
