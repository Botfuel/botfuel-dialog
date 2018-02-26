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
const logger = require('logtown')('Adapter');
const MissingImplementationError = require('../errors/missing-implementation-error');
const MiddlewareManager = require('../middleware-manager');

/**
 * An adapter adapts the messages to the messaging platform.
 */
class Adapter {
  /**
   * @constructor
   * @param {Object} bot - the bot
   */
  constructor(bot) {
    logger.debug('constructor');
    this.bot = bot;
    this.middlewareManager = new MiddlewareManager(bot);
  }

  /**
   * Plays some user messages.
   * This adapter is only implemented by the {@link TestAdapter}.
   * This method is called by the {@link Bot}'s play method.
   * @abstract
   * @async
   * @param {Object[]} userMessages - the user messages
   * @returns {Promise.<void>}
   */
  async play(userMessages) {
    logger.debug('play', userMessages);
    throw new MissingImplementationError();
  }

  /**
   * Adapter's method for running the bot.
   * This method is called by the {@link Bot}'s run method.
   * @abstract
   * @async
   * @returns {Promise.<void>}
   */
  async run() {
    logger.debug('run');
    throw new MissingImplementationError();
  }

  /**
   * Iterates over the bot messages and send them to the messaging platform.
   * @async
   * @param {Object[]} botMessages - the bot messages
   * @param {Object} userMessage - the user message
   * @returns {Promise.<void>}
   */
  async send(botMessages, userMessage) {
    logger.debug('send', botMessages);
    const context = {
      user: userMessage.user,
      brain: this.bot.brain,
      botMessages,
      config: this.bot.config,
      userMessage,
    };
    await this.middlewareManager.out(context, async () => {
      for (const botMessage of botMessages) {
        // eslint-disable-next-line no-await-in-loop
        await this.sendMessage(this.extendMessage(botMessage));
      }
    });
  }

  /**
   * Handles a user message.
   * @async
   * @param {Object} userMessage - the user message
   * @returns {Promise.<void>}
   */
  async handleMessage(userMessage) {
    logger.debug('handleMessage', userMessage);
    await this.initUserIfNecessary(userMessage.user);
    const context = {
      user: userMessage.user,
      brain: this.bot.brain,
      userMessage,
      config: this.bot.config,
    };
    await this.middlewareManager.in(context, async () => {
      await this.bot.respond(this.extendMessage(userMessage));
    });
  }

  /**
   * Inits the user if necessary.
   * Calls the corresponding method of the brain.
   * Adapters can add specific behaviour.
   * @async
   * @param {int} userId - the user id
   * @returns {Promise.<void>}
   */
  async initUserIfNecessary(userId) {
    logger.debug('initUserIfNecessary', userId);
    await this.bot.brain.initUserIfNecessary(userId);
  }

  /**
   * Sends a single bot message to the messaging platform.
   * @abstract
   * @async
   * @param {Object} botMessage - the bot message
   * @returns {Promise.<void>}
   */
  async sendMessage(botMessage) {
    logger.debug('sendMessage', botMessage);
    throw new MissingImplementationError();
  }

  /**
   * Extends a message with extra properties
   * @param {Object} message - bot or user message
   * @returns {Object} the message extended with properties
   */
  extendMessage(message) {
    logger.debug('extendMessage', message);
    return {
      id: this.getMessageUUID(),
      timestamp: this.getMessageTimestamp(),
      ...message,
    };
  }

  /**
   * Generates an uuid
   * @returns {String} the uuid
   */
  getMessageUUID() {
    logger.debug('getMessageUUID');
    return uuidv4();
  }

  /**
   * Generates a timestamp
   * @returns {Number} the timestamp
   */
  getMessageTimestamp() {
    logger.debug('getMessageTimestamp');
    return Date.now();
  }
}

module.exports = Adapter;
