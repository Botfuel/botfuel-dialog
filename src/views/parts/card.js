class Card {
  // TODO : this is very Messenger specific, let's generalize it!
  constructor(title, buttons, image_url) {
    this.title = title;
    this.image_url = image_url;
    this.buttons = buttons;
  }
}

module.exports = Card;
