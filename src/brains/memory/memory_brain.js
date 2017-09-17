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
  clean() {
    console.log('MemoryBrain.clean');
    this.users = {};
    return Promise.resolve();
  }

  /**
   * Check if brain has user for a given userId
   * @param {string} userId - user id
   */
  hasUser(userId) {
    console.log('MemoryBrain.hasUser', userId);
    return Promise.resolve(this.users[userId] !== undefined);
  }

  /**
   * Add an user
   * @param {string} userId - user id
   * @returns {Promise}
   */
  addUser(userId) {
    console.log('MemoryBrain.addUser', userId);
    return new Promise((resolve, reject) => {
      if (!this.users[userId]) {
        const newUser = {
          botId: this.botId,
          userId,
          conversations: [],
          dialogs: [],
          createdAt: Date.now(),
        };
        this.users[userId] = newUser;
        resolve(newUser);
      } else {
        reject(new Error('An user with this id for this bot already exists'));
      }
    });
  }

  /**
   * Get an user
   * @param {string} userId - user id
   * @returns {Promise}
   */
  getUser(userId) {
    console.log('MemoryBrain.getUser', userId);
    return new Promise((resolve, reject) => {
      if (this.users[userId]) {
        resolve(this.users[userId]);
      } else {
        reject(new Error('User not exists'));
      }
    });
  }

  /**
   * Set user key
   * @param {string} userId - user id
   * @param {string} key - user key
   * @param {*} value - key value
   * @returns {Promise}
   */
  userSet(userId, key, value) {
    console.log('MemoryBrain.userSet', userId, key, value);
    return new Promise((resolve, reject) => {
      this
        .getUser(userId)
        .then((user) => {
          user[key] = value;
          resolve(user);
        })
        .catch(reject);
    });
  }

  /**
   * Get user key
   * @param {string} userId - user id
   * @param {string} key - user key
   * @returns {Promise}
   */
  userGet(userId, key) {
    console.log('MemoryBrain.userGet', userId, key);
    return new Promise((resolve, reject) => {
      this
        .getUser(userId)
        .then(user => {
          resolve(user[key]);
        })
        .catch(reject);
    });
  }

  /**
   * Push value to user key array
   * @param {string} userId - user id
   * @param {string} key - user array key
   * @param {Object} value - Object value
   * @returns {Promise}
   */
  userPush(userId, key, value) {
    console.log('MemoryBrain.userPush', userId, key, value);
    return new Promise((resolve, reject) => {
      this
        .getUser(userId)
        .then((user) => {
          if (user[key]) {
            if (_.isArray(user[key])) {
              user[key].push(value);
              resolve(user);
            } else {
              reject(new Error('User key is not an array'));
            }
          } else {
            user[key] = [value];
            resolve(user);
          }
        })
        .catch(reject);
    });
  }

  /**
   * Add a conversation to an user
   * @param {string} userId - user id
   * @returns {Promise}
   */
  addConversation(userId) {
    console.log('MemoryBrain.addConversation', userId);
    return new Promise((resolve, reject) => {
      const conversation = { createdAt: Date.now() };
      this
        .userPush(userId, 'conversations', conversation)
        .then(() => resolve(conversation))
        .catch(err => reject(err));
    });
  }

  /**
   * Get user last conversation
   * @param {string} userId - user id
   * @returns {Promise}
   */
  getLastConversation(userId) {
    console.log('MemoryBrain.getLastConversation', userId);
    return new Promise((resolve, reject) => {
      this
        .getUser(userId)
        .then(user => resolve(_.last(user.conversations)))
        .catch(reject);
    });
  }

  /**
   * Set last conversation key with value
   * @param {string} userId - user id
   * @param {string} key - conversation key
   * @param {*} value - key value
   * @returns {Promise}
   */
  conversationSet(userId, key, value) {
    console.log('MemoryBrain.conversationSet', userId, key, value);
    return new Promise((resolve, reject) => {
      this
        .getLastConversation(userId)
        .then((conversation) => {
          conversation[key] = value;
          resolve(conversation);
        })
        .catch(reject);
    });
  }
}

module.exports = MemoryBrain;
