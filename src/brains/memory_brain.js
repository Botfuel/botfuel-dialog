const _ = require('lodash');
const logger = require('logtown')('MemoryBrain');
const Brain = require('./brain');

/**
 * MemoryBrain
 * @extends Brain
 */
class MemoryBrain extends Brain {
  /**
   * @constructor
   * @param {string} botId - the bot id
   */
  constructor(botId) {
    logger.debug('constructor', botId);
    super(botId);
    this.users = {};
  }

  /**
   * Clean the brain
   * @async
   */
  async clean() {
    logger.debug('clean');
    this.users = {};
  }

  /**
   * Check if brain has user for a given userId
   * @async
   * @param {string} userId - user id
   * @return {boolean} the user exists
   */
  async hasUser(userId) {
    logger.debug('hasUser', userId);
    return this.users[userId] !== undefined;
  }

  /**
   * Add an user
   * @async
   * @param {string} userId - user id
   * @return {Promise.<object>} the new user
   */
  async addUser(userId) {
    logger.debug('addUser', userId);
    if (await this.hasUser(userId)) {
      throw new Error('An user with this id for this bot already exists');
    }
    const newUser = {
      botId: this.botId,
      userId,
      conversations: [],
      dialogs: [],
      createdAt: Date.now(),
    };
    this.users[userId] = newUser;
    return newUser;
  }

  /**
   * Get an user
   * @async
   * @param {string} userId - user id
   * @return {Promise.<object>} the user
   */
  async getUser(userId) {
    logger.debug('getUser', userId);
    if (!await this.hasUser(userId)) {
      throw new Error('User not exists');
    }
    return this.users[userId];
  }

  /**
   * Set user key with the value
   * @async
   * @param {string} userId - user id
   * @param {string} key - user key
   * @param {*} value - key value
   * @return {Promise.<object>} the updated user
   */
  async userSet(userId, key, value) {
    logger.debug('userSet', userId, key, value);
    const user = await this.getUser(userId);
    user[key] = value;
    return user;
  }

  /**
   * Get user key
   * @async
   * @param {string} userId - user id
   * @param {string} key - user key
   * @return {Promise.<*>} the user key value
   */
  async userGet(userId, key) {
    logger.debug('userGet', userId, key);
    const user = await this.getUser(userId);
    return user[key];
  }

  /**
   * Push value to user key array
   * @async
   * @param {string} userId - user id
   * @param {string} key - user array key
   * @param {Object} value - Object value
   * @return {Promise.<object>} the user
   */
  async userPush(userId, key, value) {
    logger.debug('userPush', userId, key, value);
    const user = await this.getUser(userId);
    if (user[key]) {
      if (!_.isArray(user[key])) {
        throw new Error('User key is not an array');
      }
      user[key].push(value);
    } else {
      user[key] = [value];
    }
    return user;
  }

  /**
   * Shift value from user key array (first element)
   * @async
   * @param {string} userId - user id
   * @param {string} key - user array key
   * @return {Promise.<*>} the user array key first value
   */
  async userShift(userId, key) {
    logger.debug('userShift', userId, key);
    const user = await this.getUser(userId);
    if (user[key] === undefined || !_.isArray(user[key])) {
      throw new Error('User key is not an array');
    }
    return user[key].shift();
  }


  /**
   * Pop value from user key array (last element)
   * @async
   * @param {string} userId - user id
   * @param {string} key - user array key
   * @return {Promise.<*>} the user array key last value
   */
  async userPop(userId, key) {
    logger.debug('userPop', userId, key);
    const user = await this.getUser(userId);
    if (user[key] === undefined || !_.isArray(user[key])) {
      throw new Error('User key is not an array');
    }
    return user[key].pop();
  }

  /**
   * Add a conversation to an user
   * @async
   * @param {string} userId - user id
   * @return {Promise.<object>} the last conversation added
   */
  async addConversation(userId) {
    logger.debug('addConversation', userId);
    const conversation = { createdAt: Date.now() };
    await this.userPush(userId, 'conversations', conversation);
    return conversation;
  }

  /**
   * Get user last conversation
   * @async
   * @param {string} userId - user id
   * @return {Promise.<object>} the last conversation of the user
   */
  async getLastConversation(userId) {
    logger.debug('getLastConversation', userId);
    const user = await this.getUser(userId);
    return _.last(user.conversations);
  }

  /**
   * Set last conversation key with value
   * @async
   * @param {string} userId - user id
   * @param {string} key - conversation key
   * @param {*} value - key value
   * @return {Promise.<object>} the updated conversation
   */
  async conversationSet(userId, key, value) {
    logger.debug('conversationSet', userId, key, value);
    const conversation = await this.getLastConversation(userId);
    conversation[key] = value;
    return conversation;
  }
}

module.exports = MemoryBrain;
