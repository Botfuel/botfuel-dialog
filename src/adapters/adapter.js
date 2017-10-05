const Messages = require('../messages');

/**
 * Adapts messages.
 */
class Adapter {
  constructor(bot, config) {
    console.log('Adapter.constructor', '<bot>', config);
    this.config = config;
    this.bot = bot;
  }

  async play(userMsgs) {
    console.log('Adapter.play', userMsgs);
    throw new Error('Not implemented!');
  }

  async run() {
    console.log('Adapter.run');
    throw new Error('Not implemented!');
  }

  /**
   * @param botMessages
   * @returns {Promise}
   */
  async send(botMessages) {
    console.log('Adapter.send', botMessages);
    for (const botMessage of botMessages) {
      switch (botMessage.type) {
        case Messages.TYPE_ACTIONS:
          await this.sendActions(botMessage);
          break;
        case Messages.TYPE_QUICKREPLIES:
          await this.sendQuickreplies(botMessage);
          break;
        case Messages.TYPE_CARDS:
          await this.sendCards(botMessage);
          break;
        case Messages.TYPE_IMAGE:
          await this.sendImage(botMessage);
          break;
        case Messages.TYPE_TEXT:
        default:
          await this.sendText(botMessage);
      }
    }
  }
}

module.exports = Adapter;
