/**
 * Adapter main class.
 */
class Adapter {
  constructor(bot, config) {
    console.log('Adapter.constructor');
    this.config = config;
    this.bot = bot;
  }
}

module.exports = Adapter;
