/**
 * Adapter main class.
 */
class Adapter {
  constructor(bot, config) {
    console.log('Adapter.constructor');
    this.config = config;
    this.bot = bot;
  }

  async initUserIfNecessary(id) {
    console.log('TestAdapter.initUserIfNecessary');
    const userExists = await this.bot.brain.hasUser(id);
    if (!userExists) {
      await this.bot.brain.addUser(id);
    }
  }

  async play(userMessages) {
    console.log('Adapter.play', userMessages);
    throw new Error('Not implemented!');
  }

  async run() {
    console.log('TestAdapter.run');
    throw new Error('Not implemented!');
  }
}

module.exports = Adapter;
