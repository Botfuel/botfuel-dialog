/**
 * Adapter main class.
 */
class Adapter {
  constructor(bot, config) {
    // console.log('Adapter.constructor');
    this.config = config;
    this.bot = bot;
    this.dayInMs = 86400000; // One day in milliseconds
  }

  async play(userMessages) {
    console.log('Adapter.play', userMessages);
    throw new Error('Not implemented!');
  }

  async run() {
    console.log('Adapter.run');
    throw new Error('Not implemented!');
  }

  async initUserIfNecessary(id) {
    console.log('Adapter.initUserIfNecessary', id);
    const userExists = await this.bot.brain.hasUser(id);
    if (!userExists) {
      await this.bot.brain.addUser(id);
    }
    await this.initLastConversationIfNecessary(id);
  }

  async initLastConversationIfNecessary(id) {
    const lastConversation = await this.bot.brain.getLastConversation(id);
    console.log('Adapter.initLastConversationIfNecessary', id, lastConversation);
    if (!this.isLastConversationValid(lastConversation)) {
      console.log('Adapter.initLastConversationIfNecessary: initialize new');
      await this.bot.brain.addConversation(id);
    }
  }

  isLastConversationValid(conversation) {
    if (!conversation) {
      return false;
    }
    // return true if last conversation time diff with now is less than one day
    return (Date.now() - conversation.createdAt) < this.dayInMs;
  }
}

module.exports = Adapter;
