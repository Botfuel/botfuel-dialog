const _ = require('lodash');
const MongoClient = require('mongodb').MongoClient;
const logger = require('logtown')('MongoBrain');
const Brain = require('./brain');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/sdk-brain';

/**
 * Brain with MongoDB storage.
 */
class MongoBrain extends Brain {
  // eslint-disable-next-line require-jsdoc
  constructor(botId) {
    logger.debug('constructor', botId);
    super(botId);
    this.users = null;
  }

  // eslint-disable-next-line require-jsdoc
  async clean() {
    logger.debug('clean');
    return this.users.deleteMany({ botId: this.botId });
  }

  // eslint-disable-next-line require-jsdoc
  async init() {
    logger.debug('init');
    this.db = await MongoClient.connect(mongoUri);
    this.users = this.db.collection('users');
  }

  /**
   * Drops the database.
   * @async
   * @returns {Promise.<void>}
   */
  async dropDatabase() {
    await this.db.dropDatabase();
  }

  // eslint-disable-next-line require-jsdoc
  async hasUser(userId) {
    logger.debug('hasUser', userId);
    const user = await this.users.findOne({ botId: this.botId, userId });
    return user !== null;
  }

  // eslint-disable-next-line require-jsdoc
  async addUser(userId) {
    logger.debug('addUser', userId);
    const result = await this.users.insertOne(this.getUserInitValue(userId));
    return result.ops[0];
  }

  // eslint-disable-next-line require-jsdoc
  async getUser(userId) {
    logger.debug('getUser', userId);
    return this.users.findOne({ botId: this.botId, userId });
  }

  // eslint-disable-next-line require-jsdoc
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

  // eslint-disable-next-line require-jsdoc
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
