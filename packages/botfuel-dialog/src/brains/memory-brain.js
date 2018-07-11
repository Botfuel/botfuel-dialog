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

const logger = require('logtown')('MemoryBrain');
const last = require('lodash/last');
const Brain = require('./brain');

/**
 * Brain with in-memory storage.
 * @extends Brain
 */
class MemoryBrain extends Brain {
  /** @inheritdoc */
  constructor(config) {
    logger.debug('constructor');
    super(config);
    this.clean();
  }

  /** @inheritdoc */
  async clean() {
    logger.debug('clean');
    this.users = {};
    this.global = {};
  }

  /** @inheritdoc */
  async hasUser(userId) {
    logger.debug('hasUser', userId);
    return this.users[userId] !== undefined;
  }

  /** @inheritdoc */
  async addUser(userId) {
    logger.debug('addUser', userId);
    if (await this.hasUser(userId)) {
      throw new Error('This user already exists');
    }
    const newUser = this.getUserInitValue(userId);
    this.users[userId] = newUser;
    return newUser;
  }

  /** @inheritdoc */
  async getUser(userId) {
    logger.debug('getUser', userId);
    if (!(await this.hasUser(userId))) {
      throw new Error('User does not exist');
    }
    return this.users[userId];
  }

  /** @inheritdoc */
  async getAllUsers() {
    logger.debug('getAllUsers');
    return Object.values(this.users);
  }

  /** @inheritdoc */
  async userSet(userId, key, value) {
    logger.debug('userSet', userId, key, value);
    const user = await this.getUser(userId);
    user[key] = value;
    return user;
  }

  /** @inheritdoc */
  async fetchLastConversation(userId) {
    logger.debug('fetchLastConversation', userId);
    const user = await this.getUser(userId);
    const conversation = last(user._conversations);
    return this.isConversationValid(conversation) ? conversation : this.addConversation(userId);
  }

  /** @inheritdoc */
  async addConversation(userId) {
    logger.debug('addConversation', userId);
    const user = await this.getUser(userId);
    const conversation = this.getConversationInitValue();
    user._conversations.push(conversation);
    return conversation;
  }

  /** @inheritdoc */
  async conversationSet(userId, key, value) {
    logger.debug('conversationSet', userId, key, value);
    const lastConversation = await this.fetchLastConversation(userId);
    lastConversation[key] = value;
    return lastConversation;
  }

  /** @inheritdoc */
  async botGet(key) {
    return this.global[key];
  }

  /** @inheritdoc */
  async botSet(key, value) {
    this.global[key] = value;
    return value;
  }
}

module.exports = MemoryBrain;
