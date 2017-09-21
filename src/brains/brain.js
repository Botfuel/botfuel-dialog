class Brain {
  /**
   * Constructor
   * @param {string} botId - bot id
   */
  constructor(botId) {
    this.botId = botId;
    // TODO: get from config or default value below
    this.dayInMs = 86400000; // One day in milliseconds
  }

  /**
   * Add user if not exists
   * @param id
   * @returns {Promise.<void>}
   */
  async initUserIfNecessary(id) {
    console.log('Brain.initUserIfNecessary', id);
    const userExists = await this.hasUser(id);
    if (!userExists) {
      await this.addUser(id);
    }
    await this.initLastConversationIfNecessary(id);
  }

  /**
   * Add conversation to user if necessary
   * @param id
   * @returns {Promise.<void>}
   */
  async initLastConversationIfNecessary(id) {
    const lastConversation = await this.getLastConversation(id);
    console.log('Brain.initLastConversationIfNecessary', id, lastConversation);
    if (!this.isLastConversationValid(lastConversation)) {
      console.log('Brain.initLastConversationIfNecessary: initialize new');
      await this.addConversation(id);
    }
  }

  /**
   * Validate user last conversation
   * @param conversation
   * @returns {boolean}
   */
  isLastConversationValid(conversation) {
    if (!conversation) {
      return false;
    }
    // return true if last conversation time diff with now is less than one day
    return (Date.now() - conversation.createdAt) < this.dayInMs;
  }

  /**
   * Get last conversation key value
   * @param {string} userId - user id
   * @param {string} key - last conversation key
   * @returns {Promise}
   */
  async conversationGet(userId, key) {
    console.log('Brain.conversationGet', userId, key);
    const conversation = await this.getLastConversation(userId);
    return conversation[key];
  }
}

module.exports = Brain;
