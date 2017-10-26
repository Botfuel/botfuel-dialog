class Message {
  constructor(type, sender, bot, user, value, options) {
    this.type = type;
    this.sender = sender;
    this.bot = bot;
    this.user = user;
    this.value = value;
    this.options = options;
  }

  toJson() {
    if (this.options !== undefined) {
      return {
        type: this.type,
        sender: this.sender,
        bot: this.bot,
        user: this.user,
        payload: {
          value: this.value,
          options: this.options,
        },
      };
    }
    return {
      type: this.type,
      sender: this.sender,
      bot: this.bot,
      user: this.user,
      payload: {
        value: this.value,
      },
    };
  }
}

module.exports = Message;
