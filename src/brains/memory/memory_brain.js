const _ = require('lodash');
const Brain = require('../brain');

/**
 * Class to wrap memory brains
 */
class MemoryBrain extends Brain {
  /**
   * Constructor
   * @param {string} botId - bot id
   */
  constructor(botId) {
    console.log('MemoryBrain.constructor', botId);
    super(botId);
    this.users = {};
  }

  /**
   * Clean the brain
   * @returns {Promise}
   */
  async clean() {
    console.log('MemoryBrain.clean');
    this.users = {};
  }

  /**
   * Check if brain has user for a given userId
   * @param {string} userId - user id
   */
  async hasUser(userId) {
    console.log('MemoryBrain.hasUser', userId);
    return this.users[userId] !== undefined;
  }

  /**
   * Add an user
   * @param {string} userId - user id
   * @returns {Promise}
   */
  async addUser(userId) {
    console.log('MemoryBrain.addUser', userId);
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
    console.log('MemoryBrain.getUser', userId);
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
    console.log('MemoryBrain.userSet', userId, key, value);
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
    console.log('MemoryBrain.userGet', userId, key);
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
    console.log('MemoryBrain.userPush', userId, key, value);
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
    console.log('MemoryBrain.userShift', userId, key);
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
    console.log('MemoryBrain.userPop', userId, key);
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
    console.log('MemoryBrain.addConversation', userId);
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
    console.log('MemoryBrain.getLastConversation', userId);
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
    console.log('MemoryBrain.conversationSet', userId, key, value);
    const conversation = await this.getLastConversation(userId);
    conversation[key] = value;
    return conversation;
  }
}

module.exports = MemoryBrain;
