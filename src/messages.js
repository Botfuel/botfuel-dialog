class Messages {
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

Messages.TYPE_TEXT = 'text';
Messages.TYPE_TABLE = 'table';
Messages.TYPE_ACTIONS = 'actions';
Messages.TYPE_POSTBACK = 'postback';
Messages.SENDER_BOT = 'bot';
Messages.SENDER_USER = 'user';

module.exports = Messages;
