const TYPE_TEXT = 'text';
const TYPE_TABLE = 'table';
const TYPE_ACTIONS = 'actions';
const TYPE_POSTBACK = 'POSTBACK';
const SENDER_BOT = 'bot';
const SENDER_USER = 'user';

class Messages {
  static botText(bot, user, value, options) {
    console.log('Messages.botText', bot, user, value, options);
    return {
      type: TYPE_TEXT,
      sender: SENDER_BOT,
      user,
      bot,
      payload : {
        value,
        options,
      }
    };
  }

  static botActions(bot, user, value, options) {
    console.log('Messages.botPostbackButtons', bot, user, value, options);
    throw new Error('Not yet implemented!');
  }

  static userText(bot, user, value, options) {
    console.log('Messages.userText', bot, user, value, options);
    return {
      type: TYPE_TEXT,
      sender: SENDER_USER,
      user,
      bot,
      payload : {
        value,
        options,
      }
    };
  }

  static userPostback(bot, user, value) {
    console.log('Messages.userPostback', bot, user, value);
    return {
      type: TYPE_POSTBACK,
      sender: SENDER_USER,
      user,
      bot,
      payload : {
        value,
        options,
      }
    };
  }
}

module.exports = Messages;
