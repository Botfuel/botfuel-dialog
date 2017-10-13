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
    throw new Error('Not implemented!');
  }
}

module.exports = Adapter;
