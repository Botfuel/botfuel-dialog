const logger = require('logtown')('MemoryBrain');
const Brain = require('./brain');

/**
 * Brain with in-memory storage.
 * @extends Brain
 */
class MemoryBrain extends Brain {
  // eslint-disable-next-line require-jsdoc
  constructor(botId) {
    logger.debug('constructor', botId);
    super(botId);
    this.users = {};
  }

  // eslint-disable-next-line require-jsdoc
  async clean() {
    logger.debug('clean');
    this.users = {};
  }

  // eslint-disable-next-line require-jsdoc
  async hasUser(userId) {
    logger.debug('hasUser', userId);
    return this.users[userId] !== undefined;
  }

  // eslint-disable-next-line require-jsdoc
  async addUser(userId) {
    logger.debug('addUser', userId);
    if (await this.hasUser(userId)) {
      throw new Error('An user with this id for this bot already exists');
    }
    const newUser = this.getUserInitValue(userId);
    this.users[userId] = newUser;
    return newUser;
  }

  // eslint-disable-next-line require-jsdoc
  async getUser(userId) {
    logger.debug('getUser', userId);
    if (!await this.hasUser(userId)) {
      throw new Error('User not exists');
    }
    return this.users[userId];
  }

  // eslint-disable-next-line require-jsdoc
  async userSet(userId, key, value) {
    logger.debug('userSet', userId, key, value);
    const user = await this.getUser(userId);
    user[key] = value;
    return user;
  }

  // eslint-disable-next-line require-jsdoc
  async conversationSet(userId, key, value) {
    logger.debug('conversationSet', userId, key, value);
    const conversation = await this.getLastConversation(userId);
    conversation[key] = value;
    return conversation;
  }
}

module.exports = MemoryBrain;
