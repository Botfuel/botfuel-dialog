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
   * @param {String} botId - the bot id
   */
  constructor(botId) {
    logger.debug('constructor', botId);
    super(botId);
    this.users = null;
  }

  /**
   * Connects to database if necessary and get users collection
   * @async
   * @returns {Promise.<void>}
   */
  async init() {
    logger.debug('init');
    this.db = await MongoClient.connect(mongoUri);
    this.users = this.db.collection('users');
  }

  /**
   * Removes the connected database
   * @async
   * @returns {Promise.<void>}
   */
  async dropDatabase() {
    await this.db.dropDatabase();
  }

  /**
   * Cleans the brain
   * @async
   * @returns {Promise.<Object>}
   */
  async clean() {
    logger.debug('clean');
    return this.users.deleteMany({ botId: this.botId });
  }

  /**
   * Checks if brain has user for a given userId
   * @async
   * @param {String} userId - user id
   * @returns {boolean} the user exists
   */
  async hasUser(userId) {
    logger.debug('hasUser', userId);
    const user = await this.users.findOne({ botId: this.botId, userId });
    return user !== null;
  }

  /**
   * Adds an user
   * @async
   * @param {String} userId - user id
   * @returns {Promise.<Object>} the new user
   */
  async addUser(userId) {
    logger.debug('addUser', userId);
    const result = await this.users.insertOne(this.getUserInitValue(userId));
    return result.ops[0];
  }

  /**
   * Gets an user
   * @async
   * @param {String} userId - user id
   * @returns {Promise.<Object>} the user
   */
  async getUser(userId) {
    logger.debug('getUser', userId);
    return this.users.findOne({ botId: this.botId, userId });
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
   * Gets user key
   * @async
   * @param {String} userId - user id
   * @param {String} key - user key
   * @returns {Promise.<*>} the user key value
   */
  async userGet(userId, key) {
    logger.debug('userGet', userId, key);
    const select = {};
    select[key] = 1;
    const user = await this.users.findOne({ botId: this.botId, userId }, select);
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
