const _ = require('lodash');
const MongoClient = require('mongodb').MongoClient;
const Brain = require('./brain');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/sdk-brain';

/**
 * Class to wrap mongodb database with two models
 */
class MongoBrain extends Brain {
  /**
   * Constructor
   * @param {string} botId - bot id
   */
  constructor(botId) {
    console.log('MongoBrain.constructor', botId);
    super(botId);
    this.users = null;
  }

  /**
   * Connect to database if necessary
   * @returns {Promise}
   */
  async init() {
    console.log('MongoBrain.init');
    this.db = await MongoClient.connect(mongoUri);
    this.users = this.db.collection('users');
  }

  /**
   * Remove the connected database
   * @returns {Promise}
   */
  async dropDatabase() {
    await this.db.dropDatabase();
  }

  /**
   * Clean the brain
   * @returns {Promise}
   */
  async clean() {
    console.log('MongoBrain.clean');
    return this.users.deleteMany({ botId: this.botId });
  }

  /**
   * Check if brain has user for a given userId
   * @param {string} userId - user id
   */
  async hasUser(userId) {
    console.log('MongoBrain.hasUser', userId);
    const user = await this.users.findOne({ botId: this.botId, userId });
    return user !== null;
  }

  /**
   * Add an user
   * @param {string} userId - user id
   * @returns {Promise}
   */
  async addUser(userId) {
    console.log('MongoBrain.addUser', userId);
    const result = await this.users.insertOne({
      botId: this.botId,
      userId,
      conversations: [],
      dialogs: [],
      createdAt: Date.now(),
    });
    return result.ops[0];
  }

  /**
   * Get an user
   * @param {string} userId - user id
   * @returns {Promise}
   */
  async getUser(userId) {
    console.log('MongoBrain.getUser', userId);
    return this.users.findOne({ botId: this.botId, userId });
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
    const set = {};
    set[key] = value;
    const result = await this.users.findOneAndUpdate(
      { botId: this.botId, userId },
      { $set: set },
      { returnOriginal: false },
    );
    return result.value;
  }

  /**
   * Get user key
   * @param {string} userId - user id
   * @param {string} key - user key
   * @returns {Promise}
   */
  async userGet(userId, key) {
    console.log('MongoBrain.userGet', userId, key);
    const select = {};
    select[key] = 1;
    const user = await this.users.findOne({ botId: this.botId, userId }, select);
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
    console.log('MongoBrain.userPush', userId, key, value);
    const push = {};
    push[key] = value;
    const result = await this.users.findOneAndUpdate(
      { botId: this.botId, userId },
      { $push: push },
      { returnOriginal: false },
    );
    return result.value;
  }

  /**
   * Shift value from user key array (first element)
   * @param {string} userId - user id
   * @param {string} key - user array key
   * @returns {Promise}
   */
  async userShift(userId, key) {
    console.log('MongoBrain.userShift', userId, key);
    const pop = {};
    pop[key] = -1;
    const result = await this.users.findOneAndUpdate({ botId: this.botId, userId }, { $pop: pop });
    return result.value[key].shift();
  }

  /**
   * Pop value from user key array (last element)
   * @param {string} userId - user id
   * @param {string} key - user array key
   * @returns {Promise}
   */
  async userPop(userId, key) {
    console.log('MongoBrain.userPop', userId, key);
    const pop = {};
    pop[key] = 1;
    const result = await this.users.findOneAndUpdate({ botId: this.botId, userId }, { $pop: pop });
    return result.value[key].pop();
  }

  /**
   * Add a conversation to an user
   * @param {string} userId - user id
   * @returns {Promise}
   */
  async addConversation(userId) {
    console.log('MongoBrain.addConversation', userId);
    const push = { conversations: { createdAt: Date.now() } };
    const result = await this.users.findOneAndUpdate(
      { botId: this.botId, userId },
      { $push: push },
      { returnOriginal: false },
    );
    return _.last(result.value.conversations);
  }

  /**
   * Get user last conversation
   * @param {string} userId - user id
   * @returns {Promise}
   */
  async getLastConversation(userId) {
    console.log('MongoBrain.getLastConversation', userId);
    const result = await this.users.findOne({ botId: this.botId, userId }, { conversations: 1 });
    return _.last(result.conversations);
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
    const lastConversation = await this.getLastConversation(userId);
    const set = {};
    set[`conversations.$.${key}`] = value;
    const result = await this.users.findOneAndUpdate(
      { botId: this.botId, userId, 'conversations.createdAt': lastConversation.createdAt },
      { $set: set },
      { returnOriginal: false },
    );
    return _.last(result.value.conversations);
  }
}

module.exports = MongoBrain;
