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

const MongoClient = require('mongodb').MongoClient;
const logger = require('logtown')('MongoBrain');
const MissingCredentialsError = require('../errors/missing-credentials-error');
const Brain = require('./brain');

/**
 * Brain with MongoDB storage.
 */
class MongoBrain extends Brain {
  /** @inheritdoc */
  constructor() {
    logger.debug('constructor');
    super();
    this.users = null;
  }

  /** @inheritdoc */
  async init() {
    logger.debug('init');
    this.db = await MongoClient.connect(this.getMongoDbUri());
    this.users = this.db.collection('users');
    this.bots = this.db.collection('bots');
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
    return this.users.deleteMany();
  }

  /** @inheritdoc */
  async hasUser(userId) {
    logger.debug('hasUser', userId);
    const user = await this.users.findOne({ userId });
    return user !== null;
  }

  /** @inheritdoc */
  async addUser(userId) {
    logger.debug('addUser', userId);
    const result = await this.users.insertOne(this.getUserInitValue(userId));
    return result.ops[0];
  }

  /** @inheritdoc */
  async getUser(userId) {
    logger.debug('getUser', userId);
    return this.users.findOne({ userId });
  }

  /** @inheritdoc */
  async userSet(userId, key, value) {
    logger.debug('userSet', userId, key, value);
    const result = await this.users.findOneAndUpdate(
      { userId },
      { $set: { [key]: value } },
      { returnOriginal: false },
    );
    return result.value;
  }

  /** @inheritdoc */
  async getLastConversation(userId) {
    logger.debug('getLastConversation', userId);
    const user = await this.users.findOne({ userId }, { conversations: { $slice: 1 } });
    const conversation = user.conversations[0];
    return this.isConversationValid(conversation) ? conversation : this.addConversation(userId);
  }

  /** @inheritdoc */
  async addConversation(userId) {
    logger.debug('addConversation', userId);
    const result = await this.users.findOneAndUpdate(
      { userId },
      { $push: { conversations: { $each: [this.getConversationInitValue()], $position: 0 } } },
      { returnOriginal: false },
    );
    return result.value.conversations[0];
  }

  /** @inheritdoc */
  async conversationSet(userId, key, value) {
    logger.debug('conversationSet', userId, key, value);
    const lastConversation = await this.getLastConversation(userId);
    const result = await this.users.findOneAndUpdate(
      { userId, 'conversations.createdAt': lastConversation.createdAt },
      { $set: { [`conversations.0.${key}`]: value } },
      { returnOriginal: false, sort: { 'conversations.createdAt': -1 } },
    );
    return result.value.conversations[0];
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
  async getValue(key) {
    const bot = await this.bots.findOne({});

    return bot && bot[key];
  }

  /** @inheritdoc */
  async setValue(key, value) {
    const bot = await this.bots.findOneAndUpdate(
      {},
      {
        $set: { [key]: value },
      },
      {
        upsert: true,
      },
    );

    return bot[key];
  }
}

module.exports = MongoBrain;
