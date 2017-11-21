const logger = require('logtown')('MemoryBrain');
const Brain = require('./brain');

/**
 * MemoryBrain
 * @extends Brain
 */
class MemoryBrain extends Brain {
  /**
   * @constructor
   * @param {String} botId - the bot id
   */
  constructor(botId) {
    logger.debug('constructor', botId);
    super(botId);
    this.users = {};
  }

  /**
   * Cleans the brain
   * @async
   * @returns {Promise.<void>}
   */
  async clean() {
    logger.debug('clean');
    this.users = {};
  }

  /**
   * Checks if brain has user for a given userId
   * @async
   * @param {String} userId - user id
   * @returns {boolean} the user exists
   */
  async hasUser(userId) {
    logger.debug('hasUser', userId);
    return this.users[userId] !== undefined;
  }

  /**
   * Adds an user
   * @async
   * @param {String} userId - user id
   * @returns {Promise.<Object>} the new user
   */
  async addUser(userId) {
    logger.debug('addUser', userId);
    if (await this.hasUser(userId)) {
      throw new Error('An user with this id for this bot already exists');
    }
    const newUser = this.getUserInitValue(userId);
    this.users[userId] = newUser;
    return newUser;
  }

  /**
   * Gets an user
   * @async
   * @param {String} userId - user id
   * @returns {Promise.<Object>} the user
   */
  async getUser(userId) {
    logger.debug('getUser', userId);
    if (!await this.hasUser(userId)) {
      throw new Error('User not exists');
    }
    return this.users[userId];
  }

  /**
   * Sets user key with the value
   * @async
   * @param {String} userId - user id
   * @param {String} key - user key
   * @param {*} value - key value
   * @returns {Promise.<Object>} the updated user
   */
  async userSet(userId, key, value) {
    logger.debug('userSet', userId, key, value);
    const user = await this.getUser(userId);
    user[key] = value;
    return user;
  }

  /**
   * Gets user key
   * @async
   * @param {String} userId - user id
   * @param {String} key - user key
   * @returns {Promise.<*>} the user key value
   */
  async userGet(userId, key) {
    logger.debug('userGet', userId, key);
    const user = await this.getUser(userId);
    return user[key];
  }

  /**
   * Sets last conversation key with value
   * @async
   * @param {String} userId - user id
   * @param {String} key - conversation key
   * @param {*} value - key value
   * @returns {Promise.<Object>} the updated conversation
   */
  async conversationSet(userId, key, value) {
    logger.debug('conversationSet', userId, key, value);
    const conversation = await this.getLastConversation(userId);
    conversation[key] = value;
    return conversation;
  }
}

module.exports = MemoryBrain;
