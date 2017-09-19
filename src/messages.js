class Messages {
  static getBotTextMessage(botId, userId, payload) {
    console.log('Messages.getBotTextMessage', botId, userId, payload);
    return {
      type: 'text',
      userId,
      botId,
      origin: 'bot',
      payload,
    };
  }

  static getBotImageMessage(botId, userId, payload) {
    console.log('Messages.getBotImageMessage', botId, userId, payload);
    throw new Error('Not yet implemented!');
  }

  static getBotPostbackButtonsMessage(botId, userId, payload) {
    console.log('Messages.getBotPostbackButtonsMessage', botId, userId, payload);
    throw new Error('Not yet implemented!');
  }

  static getBotReplyButtonsMessage(botId, userId, payload) {
    console.log('Messages.getBotReplyButtonsMessage', botId, userId, payload);
    throw new Error('Not yet implemented!');
  }

  static getUserTextMessage(botId, userId, payload) {
    console.log('Messages.getUserTextMessage', botId, userId, payload);
    return {
      type: 'text',
      userId,
      botId,
      origin: 'user',
      payload,
    };
  }

  static getUserImageMessage(botId, userId, payload) {
    console.log('Messages.getUserImageMessage', botId, userId, payload);
    throw new Error('Not yet implemented!');
  }

  static getUserPostbackMessage(botId, userId, payload) {
    console.log('Messages.getUserPostbackMessage', botId, userId, payload);
    throw new Error('Not yet implemented!');
  }
}

module.exports = Messages;
