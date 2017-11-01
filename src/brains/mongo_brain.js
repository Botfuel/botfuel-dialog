const _ = require('lodash');
const MongoClient = require('mongodb').MongoClient;
const logger = require('logtown')('MongoBrain');
const Brain = require('./brain');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/sdk-brain';

/**
 * Brain that wrap mongodb database
 */
class MongoBrain extends Brain {
  /**
   * @constructor
   * @param {string} botId - the bot id
   */
  constructor(botId) {
    logger.debug('constructor', botId);
    super(botId);
    this.users = null;
  }

  /**
   * Connect to database if necessary and get users collection
   * @async
   */
  async init() {
    logger.debug('init');
    this.db = await MongoClient.connect(mongoUri);
    this.users = this.db.collection('users');
  }

  /**
   * Remove the connected database
   * @async
   */
  async dropDatabase() {
    await this.db.dropDatabase();
  }

  /**
   * Clean the brain
   * @async
   * @return {Promise.<object>}
   */
  async clean() {
    logger.debug('clean');
    return this.users.deleteMany({ botId: this.botId });
  }

  /**
   * Check if brain has user for a given userId
   * @async
   * @param {string} userId - user id
   * @return {boolean} the user exists
   */
  async hasUser(userId) {
    logger.debug('hasUser', userId);
    const user = await this.users.findOne({ botId: this.botId, userId });
    return user !== null;
  }

  /**
   * Add an user
   * @async
   * @param {string} userId - user id
   * @return {Promise.<object>} the new user
   */
  async addUser(userId) {
    logger.debug('addUser', userId);
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
   * @async
   * @param {string} userId - user id
   * @return {Promise.<object>} the user
   */
  async getUser(userId) {
    logger.debug('getUser', userId);
    return this.users.findOne({ botId: this.botId, userId });
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
   * @async
   * @param {string} userId - user id
   * @param {string} key - user key
   * @return {Promise.<*>} the user key value
   */
  async userGet(userId, key) {
    logger.debug('userGet', userId, key);
    const select = {};
    select[key] = 1;
    const user = await this.users.findOne({ botId: this.botId, userId }, select);
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
   * @async
   * @param {string} userId - user id
   * @param {string} key - user array key
   * @return {Promise.<*>} the user array key first value
   */
  async userShift(userId, key) {
    logger.debug('userShift', userId, key);
    const pop = {};
    pop[key] = -1;
    const result = await this.users.findOneAndUpdate({ botId: this.botId, userId }, { $pop: pop });
    return result.value[key].shift();
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
    const pop = {};
    pop[key] = 1;
    const result = await this.users.findOneAndUpdate({ botId: this.botId, userId }, { $pop: pop });
    return result.value[key].pop();
  }

  /**
   * Add a conversation to an user
   * @async
   * @param {string} userId - user id
   * @return {Promise.<object>} the last conversation added
   */
  async addConversation(userId) {
    logger.debug('addConversation', userId);
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
   * @async
   * @param {string} userId - user id
   * @return {Promise.<object>} the last conversation of the user
   */
  async getLastConversation(userId) {
    logger.debug('getLastConversation', userId);
    const result = await this.users.findOne({ botId: this.botId, userId }, { conversations: 1 });
    return _.last(result.conversations);
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
