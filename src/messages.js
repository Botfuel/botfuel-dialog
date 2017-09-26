class Messages {
  static botText(bot, user, value, options) {
    console.log('Messages.botText', bot, user, value, options);
    return Messages.create(
      Messages.TYPE_TEXT,
      Messages.SENDER_BOT,
      bot,
      user,
      value,
      options,
    );
  }

  static botActions(bot, user, value, options) {
    console.log('Messages.botActions', bot, user, value, options);
    return Messages.create(
      Messages.TYPE_ACTIONS,
      Messages.SENDER_BOT,
      bot,
      user,
      value,
      options,
    );
  }

  static botQuickreplies(bot, user, value, options) {
    console.log('Messages.botQuickreplies', bot, user, value, options);
    return Messages.create(
      Messages.TYPE_QUICKREPLIES,
      Messages.SENDER_BOT,
      bot,
      user,
      value,
      options,
    );
  }

  static botCards(bot, user, value, options) {
    console.log('Messages.botCards', bot, user, value, options);
    return Messages.create(
      Messages.TYPE_CARDS,
      Messages.SENDER_BOT,
      bot,
      user,
      value,
      options,
    );
  }

  static botImage(bot, user, value, options) {
    console.log('Messages.botImage', bot, user, value, options);
    return Messages.create(
      Messages.TYPE_IMAGE,
      Messages.SENDER_BOT,
      bot,
      user,
      value,
      options,
    );
  }

  static userText(bot, user, value, options) {
    console.log('Messages.userText', bot, user, value, options);
    return Messages.create(
      Messages.TYPE_TEXT,
      Messages.SENDER_USER,
      bot,
      user,
      value,
      options,
    );
  }

  static userPostback(bot, user, value) {
    console.log('Messages.userPostback', bot, user, value);
    return Messages.create(
      Messages.TYPE_POSTBACK,
      Messages.SENDER_USER,
      bot,
      user,
      value,
    );
  }

  static userImage(bot, user, value) {
    console.log('Messages.userImage', bot, user, value);
    return Messages.create(
      Messages.TYPE_IMAGE,
      Messages.SENDER_USER,
      bot,
      user,
      value,
    );
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

Messages.TYPE_ACTIONS = 'actions';
Messages.TYPE_CARDS = 'cards';
Messages.TYPE_POSTBACK = 'postback';
Messages.TYPE_QUICKREPLIES = 'quickreplies';
Messages.TYPE_TABLE = 'table';
Messages.TYPE_TEXT = 'text';
Messages.TYPE_IMAGE = 'image';
Messages.SENDER_BOT = 'bot';
Messages.SENDER_USER = 'user';

module.exports = Messages;
