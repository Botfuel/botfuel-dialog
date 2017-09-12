const _ = require('lodash');
const db = require('./db');
const User = require('./models/user');

/**
 * Class to wrap mongodb database with two models
 */
class MongoBrain {
  /**
   * Constructor
   * @param {string} botId - bot id
   * @param {string} mongoUri - mongo uri
   */
  constructor(botId, mongoUri = '') {
    // connect to mongodb if not connected yet
    if (!db.isConnected()) {
      db.connect(mongoUri);
    }
    this.botId = botId;
    this.userGlobalProperties = ['conversations', 'dialogs', 'lastDialog'];
  }

  /**
   * Clean the brain
   * @returns {Promise}
   */
  clean() {
    return User.remove({ botId: this.botId });
  }

  /**
   * Check if brain has user for a given userId
   * @param {string} userId - user id
   */
  hasUser(userId) {
    return new Promise((resolve, reject) => {
      User.findOne({ botId: this.botId, userId })
        .then((user) => {
          if (user) {
            resolve(true);
          }
          resolve(false);
        })
        .catch(reject);
    });
  }

  /**
   * Add an user
   * @param {string} userId - user id
   * @returns {Promise}
   */
  addUser(userId) {
    return User.create({ botId: this.botId, userId });
  }

  /**
   * Get an user
   * @param {string} userId - user id
   * @returns {Promise}
   */
  getUser(userId) {
    return new Promise((resolve, reject) => {
      User.findOne({ botId: this.botId, userId })
        .then(user => resolve(user.flatten()))
        .catch(reject);
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
      User.findOne({ botId: this.botId, userId })
        .then((user) => {
          if (_.includes(this.userGlobalProperties, key)) {
            user.set(key, value);
          } else {
            user.set(`data.${key}`, value);
          }
          user.save()
            .then(savedUser => resolve(savedUser.flatten()))
            .catch(reject);
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
    return new Promise((resolve, reject) => {
      const isGlobalProperty = _.includes(this.userGlobalProperties, key);
      const select = isGlobalProperty ? key : `data.${key}`;
      User.findOne({ botId: this.botId, userId }, select)
        .then((user) => {
          if (isGlobalProperty) {
            resolve(user[key]);
          } else {
            resolve(user.data[key]);
          }
        })
        .catch(err => reject(err));
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
    const isGlobalProperty = _.includes(this.userGlobalProperties, key);
    const pushKey = isGlobalProperty ? key : `data.${key}`;
    const push = {};
    push[pushKey] = value;
    return User.findOneAndUpdate({ botId: this.botId, userId }, { $push: push }, { new: true });
  }

  /**
   * Add a conversation to an user
   * @param {string} userId - user id
   * @returns {Promise}
   */
  addConversation(userId) {
    return new Promise((resolve, reject) => {
      const push = { conversations: {} };
      User.findOneAndUpdate({ botId: this.botId, userId }, { $push: push }, { new: true })
        .then(user => resolve(user.getLastConversation()))
        .catch(reject);
    });
  }

  /**
   * Get user last conversation
   * @param {string} userId - user id
   * @returns {Promise}
   */
  getLastConversation(userId) {
    return new Promise((resolve, reject) => {
      User.findOne({ botId: this.botId, userId })
        .then(user => resolve(user.getLastConversation()))
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
    return new Promise((resolve, reject) => {
      User.findOne({ botId: this.botId, userId })
        .then((user) => {
          user.lastConversationSet(`data.${key}`, value);
          user.save()
            .then(savedUser => resolve(savedUser.getLastConversation()))
            .catch(reject);
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
        .then(conversation => resolve(conversation[key]))
        .catch(reject);
    });
  }
}

module.exports = MongoBrain;
