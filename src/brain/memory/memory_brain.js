const _ = require('lodash');

/**
 * Class to wrap memory brain
 */
class MemoryBrain {
  /**
   * Constructor
   * @param {string} botId - bot id
   */
  constructor(botId) {
    this.botId = botId;
    this.users = {};
  }

  hasUser(userId) {
    return Promise.resolve(this.users[userId] !== undefined);
  }

  /**
   * Add an user
   * @param {string} userId - user id
   * @returns {Promise}
   */
  addUser(userId) {
    return new Promise((resolve, reject) => {
      if (!this.users[userId]) {
        const newUser = {
          botId: this.botId,
          userId,
          conversations: [],
          dialogs: [],
          lastDialog: {},
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
    return new Promise((resolve, reject) => {
      this.getUser(userId)
        .then((user) => {
          user[key] = value;
          resolve(user);
        }).catch(reject);
    });
  }

  /**
   * Get user key
   * @param {string} userId - user id
   * @param {string} key - user key
   * @returns {Promise}
   */
  userGet(userId, key) {
    return new Promise((resolve, reject) => {
      this.getUser(userId)
        .then((user) => {
          if (user[key]) {
            resolve(user[key]);
          } else {
            reject(new Error('User key is undefined'));
          }
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
    return new Promise((resolve, reject) => {
      this.getUser(userId)
        .then((user) => {
          if (user[key]) {
            user[key].push(value);
            resolve(user);
          } else {
            reject(new Error('User key is undefined'));
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
    return new Promise((resolve, reject) => {
      const conversation = { createdAt: Date.now() };
      this.userPush(userId, 'conversations', conversation)
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
    return new Promise((resolve, reject) => {
      this.getUser(userId)
        .then((user) => {
          const lastConversation = _.last(user.conversations);
          if (lastConversation) {
            resolve(lastConversation);
          } else {
            reject(new Error('Last conversation is undefined'));
          }
        }).catch(reject);
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
    return new Promise((resolve, reject) => {
      this.getLastConversation(userId)
        .then((conversation) => {
          conversation[key] = value;
          resolve(conversation);
        })
        .catch(reject);
    });
  }

  /**
   * Get last conversation key value
   * @param {string} userId - user id
   * @param {string} key - last conversation key
   * @returns {Promise}
   */
  conversationGet(userId, key) {
    return new Promise((resolve, reject) => {
      this.getLastConversation(userId)
        .then((conversation) => {
          if (conversation[key]) {
            resolve(conversation[key]);
          } else {
            reject(new Error('Conversation key is undefined'));
          }
        })
        .catch(reject);
    });
  }
}

module.exports = MemoryBrain;
