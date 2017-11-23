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

const logger = require('logtown')('Brain');
const { MissingImplementationError } = require('../errors');

/**
 * A brain is a storage for user and conversation data.
 * Some of the brain methods use a scope which is either 'user' or 'last conversation'.
 */
class Brain {
  /**
   * @constructor
   * @param {String} botId - the bot id
   */
  constructor(botId) {
    this.botId = botId;
    // TODO: get from config or default value below
    this.dayInMs = 86400000; // One day in milliseconds
  }

  /**
   * Initializes the brain.
   * @async
   * @private
   * @returns {Promise.<void>}
   */
  async init() {
    logger.debug('init');
  }

  /**
   * Empties the brain.
   * @async
   * @abstract
   * @returns {Promise.<void>}
   */
  async clean() {
    throw new MissingImplementationError();
  }

  /**
   * Gets the init value for creating a new user.
   * @param {String} userId - the user id
   * @returns {Object}
   */
  getUserModel(userId) {
    return {
      botId: this.botId,
      userId,
      conversations: [],
      dialogs: { stack: [], lastLabel: null },
      createdAt: Date.now(),
    };
  }

  /**
   * Gets the init value for creating a new conversation.
   * @returns {Object}
   */
  getConversationModel() {
    return {
      createdAt: Date.now(),
    };
  }

  /**
   * Inits a user if necessary (if he does not exist).
   * @async
   * @param {String} userId - the user id
   * @returns {Promise.<void>}
   */
  async initUserIfNecessary(userId) {
    logger.debug('initUserIfNecessary', userId);
    const userExists = await this.hasUser(userId);
    if (!userExists) {
      await this.addUser(userId);
    }
  }

  /**
   * Checks if there is a user for a given id.
   * @async
   * @abstract
   * @param {String} userId - the user id
   * @returns {boolean} true if the user exists, false otherwise
   */
  async hasUser() {
    throw new MissingImplementationError();
  }

   /**
   * Adds a user.
   * @async
   * @param {String} userId - the  user id
   * @returns {Promise.<Object>} the new user
   */
  async addUser() {
    throw new MissingImplementationError();
  }

  /**
   * Gets a user.
   * @async
   * @param {String} userId - the user id
   * @returns {Promise.<Object>} the user
   */
  async getUser() {
    throw new MissingImplementationError();
  }

  /**
   * Adds a conversation to a user.
   * @async
   * @param {String} userId - user id
   * @returns {Promise.<Object>} the last conversation added
   */
  async addConversation() {
    throw new MissingImplementationError();
  }

  /**
   * Gets the last conversation of the user.
   * @async
   * @param {String} userId - the user id
   * @returns {Promise.<Object>} the last conversation of the user
   */
  async getLastConversation() {
    throw new MissingImplementationError();
  }

  /**
   * Sets a value for a key within the scope of the user.
   * @async
   * @abstract
   * @param {String} userId - the user id
   * @param {String} key - the key
   * @param {*} value - the value
   * @returns {Promise.<Object>} the updated user
   */
  async userSet() {
    throw new MissingImplementationError();
  }

  /**
   * Gets a value for a key within the scope of the user.
   * @async
   * @param {String} userId - the user id
   * @param {String} key - the key
   * @returns {Promise.<*>} the value
   */
  async userGet(userId, key) {
    logger.debug('userGet', userId, key);
    const user = await this.getUser(userId);
    return user[key];
  }

  /**
   * Sets a value for a key within the scope of the last conversation of a user.
   * @async
   * @param {String} userId - the user id
   * @param {String} key - the key
   * @param {*} value - the  value
   * @returns {Promise.<Object>} the updated conversation
   */
  async conversationSet() {
    throw new MissingImplementationError();
  }

  /**
   * Gets the value for a given key within the scope of the last conversation of a user.
   * @async
   * @param {String} userId - user id
   * @param {String} key - last conversation key
   * @returns {Promise}
   */
  async conversationGet(userId, key) {
    logger.debug('conversationGet', userId, key);
    const conversation = await this.getLastConversation(userId);
    return conversation[key];
  }

  /**
   * Validates the last conversation of an user
   * @param {Object} conversation - the conversation
   * @returns {Boolean}
   */
  isConversationValid(conversation) {
    return conversation !== undefined && (Date.now() - conversation.createdAt) < this.dayInMs;
  }
}

module.exports = Brain;
