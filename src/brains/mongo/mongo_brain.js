const _ = require('lodash');
const Brain = require('../brain');
const db = require('./db');
const User = require('./models/user');

/**
 * Class to wrap mongodb database with two models
 */
class MongoBrain extends Brain {
  /**
   * Constructor
   * @param {string} botId - bot id
   * @param {string} mongoUri - mongo uri
   */
  constructor(botId, mongoUri = '') {
    console.log('MongoBrain.constructor', botId);
    super(botId);
    // connect to mongodb if not connected yet
    if (!db.isConnected()) {
      db.connect(mongoUri);
    }
    this.userGlobalProperties = ['conversations', 'dialogs'];
  }

  /**
   * Clean the brain
   * @returns {Promise}
   */
  async clean() {
    console.log('MongoBrain.clean');
    return User.remove({ botId: this.botId });
  }

  /**
   * Check if brain has user for a given userId
   * @param {string} userId - user id
   */
  async hasUser(userId) {
    console.log('MongoBrain.hasUser', userId);
    const user = await User.findOne({ botId: this.botId, userId });
    return user !== null;
  }

  /**
   * Add an user
   * @param {string} userId - user id
   * @returns {Promise}
   */
  async addUser(userId) {
    console.log('MongoBrain.addUser', userId);
    return User.create({ botId: this.botId, userId });
  }

  /**
   * Get an user
   * @param {string} userId - user id
   * @returns {Promise}
   */
  async getUser(userId) {
    console.log('MongoBrain.getUser', userId);
    const user = await User.findOne({ botId: this.botId, userId });
    return user.flatten();
  }

  /**
   * Set user key
   * @param {string} userId - user id
   * @param {string} key - user key
   * @param {*} value - key value
   * @returns {Promise}
   */
  async userSet(userId, key, value) {
    console.log('MongoBrain.userSet', userId, key, value);
    const user = await User.findOne({ botId: this.botId, userId });
    if (_.includes(this.userGlobalProperties, key)) {
      user.set(key, value);
    } else {
      user.set(`data.${key}`, value);
    }
    const savedUser = await user.save();
    return savedUser.flatten();
  }

  /**
   * Get user key
   * @param {string} userId - user id
   * @param {string} key - user key
   * @returns {Promise}
   */
  async userGet(userId, key) {
    console.log('MongoBrain.userGet', userId, key);
    const isGlobalProperty = _.includes(this.userGlobalProperties, key);
    const select = isGlobalProperty ? key : `data.${key}`;
    const user = await User.findOne({ botId: this.botId, userId }, select);
    return isGlobalProperty ? user[key] : user.data[key];
  }

  /**
   * Push value to user key array
   * @param {string} userId - user id
   * @param {string} key - user array key
   * @param {Object} value - Object value
   * @returns {Promise}
   */
  async userPush(userId, key, value) {
    console.log('MongoBrain.userPush', userId, key, value);
    const isGlobalProperty = _.includes(this.userGlobalProperties, key);
    const pushKey = isGlobalProperty ? key : `data.${key}`;
    const push = {};
    push[pushKey] = value;
    return User.findOneAndUpdate({ botId: this.botId, userId }, { $push: push }, { new: true });
  }

  /**
   * Shift value from user key array (first element)
   * @param {string} userId - user id
   * @param {string} key - user array key
   * @returns {Promise}
   */
  async userShift(userId, key) {
    console.log('MongoBrain.userShift', userId, key);
    const isGlobalProperty = _.includes(this.userGlobalProperties, key);
    const pop = {};
    pop[isGlobalProperty ? key : `data.${key}`] = -1;
    const user = await User.findOneAndUpdate({ botId: this.botId, userId }, { $pop: pop });
    return isGlobalProperty ? user[key].shift() : user.data[key].shift();
  }

  /**
   * Pop value from user key array (last element)
   * @param {string} userId - user id
   * @param {string} key - user array key
   * @returns {Promise}
   */
  async userPop(userId, key) {
    console.log('MongoBrain.userPop', userId, key);
    const isGlobalProperty = _.includes(this.userGlobalProperties, key);
    const pop = {};
    pop[isGlobalProperty ? key : `data.${key}`] = 1;
    const user = await User.findOneAndUpdate({ botId: this.botId, userId }, { $pop: pop });
    return isGlobalProperty ? user[key].pop() : user.data[key].pop();
  }

  /**
   * Add a conversation to an user
   * @param {string} userId - user id
   * @returns {Promise}
   */
  async addConversation(userId) {
    console.log('MongoBrain.addConversation', userId);
    const push = { conversations: {} };
    const user = await User.findOneAndUpdate(
      { botId: this.botId, userId },
      { $push: push },
      { new: true },
    );
    return user.getLastConversation();
  }

  /**
   * Get user last conversation
   * @param {string} userId - user id
   * @returns {Promise}
   */
  async getLastConversation(userId) {
    console.log('MongoBrain.getLastConversation', userId);
    const user = await User.findOne({ botId: this.botId, userId });
    return user.getLastConversation();
  }

  /**
   * Set last conversation key with value
   * @param {string} userId - user id
   * @param {string} key - conversation key
   * @param {*} value - key value
   * @returns {Promise}
   */
  async conversationSet(userId, key, value) {
    console.log('MongoBrain.conversationSet', userId, key, value);
    const user = await User.findOne({ botId: this.botId, userId });
    user.lastConversationSet(`data.${key}`, value);
    const savedUser = await user.save();
    return savedUser.getLastConversation();
  }
}

module.exports = MongoBrain;
