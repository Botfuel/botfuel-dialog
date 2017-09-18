/**
 * Adapts messages.
 */
class Adapter {
  constructor(bot, config) {
    // console.log('Adapter.constructor');
    this.config = config;
    this.bot = bot;
  }

  async play(userMessages) {
    console.log('Adapter.play', userMessages);
    throw new Error('Not implemented!');
  }

  async run() {
    console.log('Adapter.run');
    throw new Error('Not implemented!');
  }
}

module.exports = Adapter;
