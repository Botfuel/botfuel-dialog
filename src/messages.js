class Messages {
  static botText(bot, user, value, options) {
    console.log('Messages.botText', bot, user, value, options);
    return Messages.create(Messages.TYPE_TEXT, Messages.SENDER_BOT, bot, user, value, options);
  }

  static botActions(bot, user, value, options) {
    console.log('Messages.botActions', bot, user, value, options);
    return Messages.create(Messages.TYPE_ACTIONS, Messages.SENDER_BOT, bot, user, value, options);
  }

  static botQuickReplies(bot, user, value, options) {
    console.log('Messages.botQuickReplies', bot, user, value, options);
    return Messages.create(
      Messages.TYPE_QUICK_REPLIES,
      Messages.SENDER_BOT,
      bot,
      user,
      value,
      options,
    );
  }

  static botCards(bot, user, value, options) {
    console.log('Messages.botCards', bot, user, value, options);
    return Messages.create(Messages.TYPE_CARDS, Messages.SENDER_BOT, bot, user, value, options);
  }

  static userText(bot, user, value, options) {
    console.log('Messages.userText', bot, user, value, options);
    return Messages.create(Messages.TYPE_TEXT, Messages.SENDER_USER, bot, user, value, options);
  }

  static userPostback(bot, user, value) {
    console.log('Messages.userPostback', bot, user, value);
    return Messages.create(Messages.TYPE_POSTBACK, Messages.SENDER_USER, bot, user, value);
  }

  static create(type, sender, bot, user, value, options) {
    if (options !== undefined) {
      return {
        type,
        sender,
        bot,
        user,
        payload: { value, options },
      };
    }
    return {
      type,
      sender,
      bot,
      user,
      payload: { value },
    };
  }
}

Messages.TYPE_TEXT = 'text';
Messages.TYPE_TABLE = 'table';
Messages.TYPE_ACTIONS = 'actions';
Messages.TYPE_QUICK_REPLIES = 'quick_replies';
Messages.TYPE_POSTBACK = 'postback';
Messages.TYPE_CARDS = 'cards';
Messages.SENDER_BOT = 'bot';
Messages.SENDER_USER = 'user';

module.exports = Messages;
