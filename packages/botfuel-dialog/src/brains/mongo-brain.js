/**
 * Copyright (c) 2017 - present, Botfuel (https://www.botfuel.io).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { MongoClient } = require('mongodb');
const logger = require('logtown')('MongoBrain');
const MissingCredentialsError = require('../errors/missing-credentials-error');
const Brain = require('./brain');

/**
 * Brain with MongoDB storage.
 */
class MongoBrain extends Brain {
  /** @inheritdoc */
  constructor(config) {
    logger.debug('constructor');
    super(config);
  }

  /** @inheritdoc */
  async init() {
    logger.debug('init');
    this.db = await MongoClient.connect(this.getMongoDbUri());
    this.users = this.db.collection('users');
    this.global = this.db.collection('global');
    // ensure userId uniqueness
    this.users.ensureIndex({ _userId: 1 }, { unique: true });
  }

  /**
   * Returns the mongoDB connection URI.
   * @async
   * @private
   * @param {Object} userMessage - the user text message
   * @returns {Promise.<void>}
   */
  getMongoDbUri() {
    if (process.env.MONGODB_URI) {
      return process.env.MONGODB_URI;
    }
    if (!process.env.BOTFUEL_APP_TOKEN) {
      throw new MissingCredentialsError(
        'Either MONGODB_URI or BOTFUEL_APP_TOKEN is required to use the Brain with mongodb.',
      );
    }
    return `mongodb://localhost/botfuel-bot-${process.env.BOTFUEL_APP_TOKEN}`;
  }

  /** @inheritdoc */
  async clean() {
    logger.debug('clean');
    await this.global.deleteMany();
    await this.users.deleteMany();
  }

  /** @inheritdoc */
  async hasUser(userId) {
    logger.debug('hasUser', userId);
    const user = await this.users.findOne({ _userId: userId });
    return user !== null;
  }

  /** @inheritdoc */
  async addUser(userId) {
    logger.debug('addUser', userId);
    const newUser = this.getUserInitValue(userId);
    try {
      const result = await this.users.insertOne(newUser);
      return result.ops[0];
    } catch (e) {
      if (e.code === 11000) {
        // mongo unique index error code
        throw new Error('This user already exists');
      }
      throw e;
    }
  }

  /** @inheritdoc */
  async getUser(userId, ...params) {
    logger.debug('getUser', userId);
    const user = await this.users.findOne({ _userId: userId }, ...params);
    if (!user) {
      throw new Error('User does not exist');
    }
    return user;
  }

  /** @inheritdoc */
  async getAllUsers() {
    logger.debug('getAllUsers');
    return this.users.find().toArray();
  }

  /**
   * Wraps mongodb findOneAndUpdate and throws if user does not exist
   * @async
   * @abstract
   * @param {String} userId - user id
   * @returns {Promise.<Object>} the user
   */
  async findUserAndUpdate(...params) {
    const user = await this.users.findOneAndUpdate(...params);
    if (!user) {
      throw new Error('User does not exist');
    }
    return user;
  }

  /** @inheritdoc */
  async userSet(userId, key, value) {
    logger.debug('userSet', userId, key, value);
    const result = await this.findUserAndUpdate(
      { _userId: userId },
      { $set: { [key]: value } },
      { returnOriginal: false },
    );
    return result.value;
  }

  /** @inheritdoc */
  async fetchLastConversation(userId) {
    logger.debug('fetchLastConversation', userId);
    const user = await this.getUser(userId, { _conversations: { $slice: 1 } });
    const conversation = user._conversations[0];
    return this.isConversationValid(conversation) ? conversation : this.addConversation(userId);
  }

  /** @inheritdoc */
  async addConversation(userId) {
    logger.debug('addConversation', userId);
    const conversation = this.getConversationInitValue();
    const result = await this.findUserAndUpdate(
      { _userId: userId },
      { $push: { _conversations: { $each: [conversation], $position: 0 } } },
      { returnOriginal: false },
    );
    return result.value._conversations[0];
  }

  /** @inheritdoc */
  async conversationSet(userId, key, value) {
    logger.debug('conversationSet', userId, key, value);
    const result = await this.findUserAndUpdate(
      { _userId: userId },
      { $set: { [`_conversations.0.${key}`]: value } },
      { returnOriginal: false, sort: { '_conversations._createdAt': -1 } },
    );
    return result.value._conversations[0];
  }

  /**
   * Drops the database (used by tests).
   * @async
   * @returns {Promise.<void>}
   */
  async dropDatabase() {
    logger.debug('dropDatabase');
    await this.db.dropDatabase();
  }

  /** @inheritdoc */
  async botGet(key) {
    const global = await this.global.findOne({});
    return global[key];
  }

  /** @inheritdoc */
  async botSet(key, value) {
    const global = await this.global.findOneAndUpdate(
      {},
      {
        $set: { [key]: value },
      },
      {
        upsert: true,
      },
    );
    return global[key];
  }
}

module.exports = MongoBrain;
