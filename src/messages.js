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

}

module.exports = Messages;
