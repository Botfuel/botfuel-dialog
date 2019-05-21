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

const uuidv4 = require('uuid/v4');
const logger = require('logtown')('Brain');
const MissingImplementationError = require('../errors/missing-implementation-error');

/**
 * A brain is a storage for user and conversation data.
 * Some of the brain methods use a scope which is either 'user' or 'last conversation'.
 */
class Brain {
  constructor(config) {
    this.conversationDuration = config.brain.conversationDuration;
  }

  /**
   * Initializes the brain.
   * @private
   */
  async init() {
    logger.debug('init');
  }

  /**
   * Empties the brain.
   * @abstract
   */
  async clean() {
    throw new MissingImplementationError();
  }

  /**
   * Gets the init value for creating a new user.
   */
  getUserInitValue(userId) {
    return {
      _userId: userId,
      _conversations: [this.getConversationInitValue()],
      _createdAt: Date.now(),
    };
  }

  /**
   * Adds a user if necessary (if he does not exist).
   */
  async addUserIfNecessary(userId) {
    logger.debug('addUserIfNecessary', userId);
    const userExists = await this.hasUser(userId);
    if (!userExists) {
      await this.addUser(userId);
    }
  }

  /**
   * Checks if there is a user for a given id.
   * @abstract
   */
  async hasUser(userId) { // eslint-disable-line no-unused-vars
    throw new MissingImplementationError();
  }

  /**
   * Adds a user.
   */
  async addUser(userId) { // eslint-disable-line no-unused-vars
    throw new MissingImplementationError();
  }

  /**
   * Gets a user.
   */
  async getUser(userId) { // eslint-disable-line no-unused-vars
    throw new MissingImplementationError();
  }

  /**
   * Gets all users.
   * @returns the users
   */
  async getAllUsers() {
    throw new MissingImplementationError();
  }

  /**
   * Gets the init value for creating a new conversation.
   */
  getConversationInitValue() {
    return {
      _dialogs: {
        stack: [],
        previous: [],
      },
      _createdAt: Date.now(),
      uuid: uuidv4(),
    };
  }

  /**
   * Adds a conversation to a user.
   * @returns the last conversation added
   */
  async addConversation(userId) { // eslint-disable-line no-unused-vars
    throw new MissingImplementationError();
  }

  /**
   * Fetches the last conversation of the user.
   * If the last conversation found isn't valid anymore, adds a new one and returns it.
   * @returns the last conversation of the user
   */
  async fetchLastConversation(userId) { // eslint-disable-line no-unused-vars
    throw new MissingImplementationError();
  }

  /**
   * Sets a value for a key within the scope of the user.
   * @abstract
   * @returns {{ _userId: String, [key]: any }}
   * an object containing the _userId and the key/value pair
   */
  async userSet(userId, key, value) { // eslint-disable-line no-unused-vars
    throw new MissingImplementationError();
  }

  /**
   * Gets a value for a key within the scope of the user.
   */
  async userGet(userId, key) {
    logger.debug('userGet', userId, key);
    const user = await this.getUser(userId);
    return user[key];
  }

  /**
   * Sets a value for a key within the scope of the last conversation of a user.
   * @returns the updated conversation
   */
  async conversationSet(userId, key, value) { // eslint-disable-line no-unused-vars
    throw new MissingImplementationError();
  }

  /**
   * Gets the value for a given key within the scope of the last conversation of a user.
   * @returns the value
   */
  async conversationGet(userId, key) {
    logger.debug('conversationGet', userId, key);
    const conversation = await this.fetchLastConversation(userId);
    return conversation[key];
  }

  /**
   * Validates the last conversation of an user.
   */
  isConversationValid(conversation) {
    return (
      conversation !== undefined && Date.now() - conversation._createdAt < this.conversationDuration
    );
  }

  /**
   * Gets dialogs data from the last conversation.
   */
  async getDialogs(userId) {
    return this.conversationGet(userId, '_dialogs');
  }

  /**
   * Sets dialogs data in the last conversation.
   */
  async setDialogs(userId, dialogs) {
    if (dialogs.isNewConversation) {
      await this.addConversation(userId);
      delete dialogs.isNewConversation;
    }
    await this.conversationSet(userId, '_dialogs', dialogs);
  }

  /**
   * Gets a value for a key within the global scope.
   * @abstract
   */
  async botGet(key) { // eslint-disable-line no-unused-vars
    throw new MissingImplementationError();
  }

  /**
   * Sets a value for a key within the global scope.
   * @abstract
   */
  async botSet(key, value) { // eslint-disable-line no-unused-vars
    throw new MissingImplementationError();
  }
}

module.exports = Brain;
