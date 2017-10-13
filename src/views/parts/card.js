class Card {
  // TODO : this is very Messenger specific, let's generalize it!
  constructor(title, imageUrl, buttons) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.buttons = buttons;
  }

  toJson() {
    return {
      type: this.type,
      image_url: this.imageUrl,
      buttons: this.buttons.map(button => button.toJson()),
    };
  }
}

module.exports = Card;
