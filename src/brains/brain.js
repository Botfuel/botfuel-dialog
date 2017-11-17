const _ = require('lodash');
const logger = require('logtown')('Brain');

/**
 * A brain is a storage for user and conversation data.
 */
class Brain {
  /**
   * @constructor
   * @param {String} botId - the bot id
   */
  constructor(botId) {
    this.botId = botId;
    // TODO: get from config or default value below
    this.dayInMs = 86400000; // One day in milliseconds
  }

  /**
   * Initializes the brain.
   * @async
   * @returns {Promise.<void>}
   */
  async init() {
    logger.debug('Brain.init');
  }

  /**
   * Gets the init value for creating a new user.
   * @param {String} userId - the user id
   * @returns {Object}
   */
  getUserInitValue(userId) {
    return {
      botId: this.botId,
      userId,
      conversations: [],
      dialogs: { stack: [], lastLabel: null },
      createdAt: Date.now(),
    };
  }

  /**
   * Gets the init value for creating a new conversation.
   * @returns {Object}
   */
  getConversationInitValue() {
    return {
      conversations: {
        createdAt: Date.now(),
      },
    };
  }

  /**
   * Inits a user if necessary (if he does not exist).
   * @async
   * @param {String} userId - the user id
   * @returns {Promise.<void>}
   */
  async initUserIfNecessary(userId) {
    logger.debug('initUserIfNecessary', userId);
    const userExists = await this.hasUser(userId);
    if (!userExists) {
      await this.addUser(userId);
    }
    await this.initLastConversationIfNecessary(userId);
  }

  /**
   * Inits the last conversation of a user if necessary (if it does not exist).
   * @async
   * @param {String} userId - the user id
   * @returns {Promise.<void>}
   */
  async initLastConversationIfNecessary(userId) {
    logger.debug('initLastConversationIfNecessary', userId);
    const lastConversationValid = await this.isLastConversationValid(userId);
    if (!lastConversationValid) {
      await this.addConversation(userId);
    }
  }

  /**
   * Adds a conversation to a user.
   * @async
   * @param {String} userId - user id
   * @returns {Promise.<Object>} the last conversation added
   */
  async addConversation(userId) {
    logger.debug('addConversation', userId);
    const conversations = await this.userGet(userId, 'conversations');
    const conversation = this.getConversationInitValue();
    conversations.push(conversation);
    await this.userSet(userId, 'conversations', conversations);
    return conversation;
  }

  /**
   * Gets user last conversation
   * @async
   * @param {String} userId - user id
   * @returns {Promise.<Object>} the last conversation of the user
   */
  async getLastConversation(userId) {
    logger.debug('getLastConversation', userId);
    const user = await this.getUser(userId);
    return _.last(user.conversations);
  }

  /**
   * Returns a boolean indicating if the last conversation of the user is still valid.
   * @async
   * @param {String} userId - user id
   * @returns {Boolean} a boolean indicating if the last conversation is valid
   */
  async isLastConversationValid(userId) {
    const conversation = await this.getLastConversation(userId);
    if (!conversation) {
      return false;
    }
    // return true if last conversation time diff with now is less than one day
    return (Date.now() - conversation.createdAt) < this.dayInMs;
  }

  /**
   * Gets last conversation value for a given key
   * @async
   * @param {String} userId - user id
   * @param {String} key - last conversation key
   * @returns {Promise}
   */
  async conversationGet(userId, key) {
    logger.debug('conversationGet', userId, key);
    const conversation = await this.getLastConversation(userId);
    return conversation[key];
  }
}

module.exports = Brain;
