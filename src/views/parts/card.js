class Card {
  // TODO : this is very Messenger specific, let's generalize it!
  constructor(title, imageUrl, buttons) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.buttons = buttons.map(button => button.toJson());
  }

  toJson() {
    return {
      title: this.title,
      image_url: this.imageUrl,
      buttons: this.buttons,
    };
  }
}

module.exports = Card;
