const _ = require('lodash');
const logger = require('logtown')('MemoryBrain', { disable: ['debug'] });
const Brain = require('./brain');

/**
 * Class to wrap memory brains
 */
class MemoryBrain extends Brain {
  /**
   * Constructor
   * @param {string} botId - bot id
   */
  constructor(botId) {
    logger.debug('constructor', botId);
    super(botId);
    this.users = {};
  }

  /**
   * Clean the brain
   * @returns {Promise}
   */
  async clean() {
    logger.debug('clean');
    this.users = {};
  }

  /**
   * Check if brain has user for a given userId
   * @param {string} userId - user id
   */
  async hasUser(userId) {
    logger.debug('hasUser', userId);
    return this.users[userId] !== undefined;
  }

  /**
   * Add an user
   * @param {string} userId - user id
   * @returns {Promise}
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
   * @param {string} userId - user id
   * @returns {Promise}
   */
  async getUser(userId) {
    logger.debug('getUser', userId);
    if (!await this.hasUser(userId)) {
      throw new Error('User not exists');
    }
    return this.users[userId];
  }

  /**
   * Set user key
   * @param {string} userId - user id
   * @param {string} key - user key
   * @param {*} value - key value
   * @returns {Promise}
   */
  async userSet(userId, key, value) {
    logger.debug('userSet', userId, key, value);
    const user = await this.getUser(userId);
    user[key] = value;
    return user;
  }

  /**
   * Get user key
   * @param {string} userId - user id
   * @param {string} key - user key
   * @returns {Promise}
   */
  async userGet(userId, key) {
    logger.debug('userGet', userId, key);
    const user = await this.getUser(userId);
    return user[key];
  }

  /**
   * Push value to user key array
   * @param {string} userId - user id
   * @param {string} key - user array key
   * @param {Object} value - Object value
   * @returns {Promise}
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
   * @param {string} userId - user id
   * @param {string} key - user array key
   * @returns {Promise}
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
   * @param {string} userId - user id
   * @param {string} key - user array key
   * @returns {Promise}
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
   * @param {string} userId - user id
   * @returns {Promise}
   */
  async addConversation(userId) {
    logger.debug('addConversation', userId);
    const conversation = { createdAt: Date.now() };
    await this.userPush(userId, 'conversations', conversation);
    return conversation;
  }

  /**
   * Get user last conversation
   * @param {string} userId - user id
   * @returns {Promise}
   */
  async getLastConversation(userId) {
    logger.debug('getLastConversation', userId);
    const user = await this.getUser(userId);
    return _.last(user.conversations);
  }

  /**
   * Set last conversation key with value
   * @param {string} userId - user id
   * @param {string} key - conversation key
   * @param {*} value - key value
   * @returns {Promise}
   */
  async conversationSet(userId, key, value) {
    logger.debug('conversationSet', userId, key, value);
    const conversation = await this.getLastConversation(userId);
    conversation[key] = value;
    return conversation;
  }
}

module.exports = MemoryBrain;
