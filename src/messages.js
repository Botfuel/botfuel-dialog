class Messages {
  static TYPE_TEXT = 'text';
  static TYPE_TABLE = 'table';
  static TYPE_ACTIONS = 'actions';
  static TYPE_POSTBACK = 'POSTBACK';
  static SENDER_BOT = 'bot';
  static SENDER_USER = 'user';

  static botText(bot, user, value, options) {
    console.log('Messages.botText', bot, user, value, options);
    return {
      type: Messages.TYPE_TEXT,
      sender: Messages.SENDER_BOT,
      user,
      bot,
      payload: {
        value,
        options,
      },
    };
  }

  static botActions(bot, user, value, options) {
    console.log('Messages.botActions', bot, user, value, options);
    return {
      type: Messages.TYPE_ACTIONS,
      sender: Messages.SENDER_BOT,
      user,
      bot,
      payload: {
        value,
        options,
      },
    };
  }

  static botTable(bot, user, value, options) {
    console.log('Messages.botTable', bot, user, value, options);
    return {
      type: Messages.TYPE_TABLE,
      sender: Messages.SENDER_BOT,
      user,
      bot,
      payload: {
        value,
        options,
      },
    };
  }

  static userText(bot, user, value, options) {
    console.log('Messages.userText', bot, user, value, options);
    return {
      type: Messages.TYPE_TEXT,
      sender: Messages.SENDER_USER,
      user,
      bot,
      payload: {
        value,
        options,
      },
    };
  }

  static userPostback(bot, user, value, options) {
    console.log('Messages.userPostback', bot, user, value, options);
    return {
      type: Messages.TYPE_POSTBACK,
      sender: Messages.SENDER_USER,
      user,
      bot,
      payload: {
        value,
        options,
      },
    };
  }
}

module.exports = Messages;
