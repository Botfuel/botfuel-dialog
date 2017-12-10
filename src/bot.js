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

const Logger = require('logtown');
const BotfuelAdapter = require('./adapters/botfuel-adapter');
const DialogManager = require('./dialog-manager');
const MessengerAdapter = require('./adapters/messenger-adapter');
const MemoryBrain = require('./brains/memory-brain');
const MongoBrain = require('./brains/mongo-brain');
const Nlu = require('./nlu');
const ShellAdapter = require('./adapters/shell-adapter');
const TestAdapter = require('./adapters/test-adapter');
const { getConfiguration } = require('./config');
const { AuthenticationError, DialogError, ViewError } = require('./errors');

const logger = Logger.getLogger('Bot');

/**
 * This is the bot main class.
 *
 * A bot has :
 * - an {@link Adapter},
 * - a {@link Brain},
 * - a {@link Nlu} (Natural Language Understanding) module,
 * - a {@link DialogManager}.
 */
class Bot {
  /**
   * @constructor
   * @param {object} config - the bot configuration
   */
  constructor(config) {
    this.config = getConfiguration(config);
    logger.debug('constructor', this.config);
    logger.info('BOT_ID', process.env.BOT_ID);
    logger.info('BOTFUEL_APP_ID', process.env.BOTFUEL_APP_ID);
    logger.info('BOTFUEL_APP_KEY', process.env.BOTFUEL_APP_KEY);
    if (process.env.BOT_ID === undefined
        || process.env.BOTFUEL_ID === '') {
      logger.warn('Environment variable BOT_ID is not defined!');
    }
    if (process.env.BOTFUEL_APP_ID === undefined
        || process.env.BOTFUEL_APP_ID === '') {
      logger.warn('Environment variable BOTFUEL_APP_ID is not defined!');
    }
    if (process.env.BOTFUEL_APP_KEY === undefined
        || process.env.BOTFUEL_APP_KEY === '') {
      logger.warn('Environment variable BOTFUEL_APP_KEY is not defined!');
    }
    this.id = process.env.BOT_ID;
    this.adapter = this.getAdapter(this.config.adapter);
    this.brain = this.getBrain(this.config.brain);
    this.nlu = new Nlu(this.config);
    this.dm = new DialogManager(this.brain, this.config);
  }

  /**
   * Initializes the bot.
   * @async
   * @private
   * @returns {Promise.<void>}
   */
  async init() {
    await this.brain.init();
    await this.nlu.init();
  }

  /**
   * Gets brain instance
   * @param {string} brain - brain name
   * @returns {Brain}
   */
  getBrain(brain) {
    switch (brain) {
      case 'mongo':
        return new MongoBrain(this.id);
      case 'memory':
      default:
        return new MemoryBrain(this.id);
    }
  }

  /**
   * Gets adapter instance
   * @param {string} adapter - adapter name
   * @returns {Adapter}
   */
  getAdapter(adapter) {
    switch (adapter) {
      case 'botfuel':
        return new BotfuelAdapter(this);
      case 'messenger':
        return new MessengerAdapter(this);
      case 'test':
        return new TestAdapter(this);
      case 'shell':
      default:
        return new ShellAdapter(this);
    }
  }

  /**
   * Handles errors.
   * @param {Object} error - the error
   * @returns {void}
   */
  handleError(error) {
    if (error instanceof AuthenticationError) {
      logger.error('Botfuel API authentication failed!');
      logger.error('Please check your app’s credentials and that its plan limits haven’t been reached on https://api.botfuel.io');
    } else if (error instanceof ViewError) {
      const { view } = error;
      logger.error(`Could not render view '${view}'`);
    } else if (error instanceof DialogError) {
      const { dialog } = error;
      logger.error(`Could not execute dialog '${dialog}'`);
    }
    throw error;
  }

  /**
   * Runs the bot.
   * @async
   * @returns {Promise.<void>}
   */
  async run() {
    logger.debug('run');
    try {
      await this.init();
      await this.adapter.run();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Plays user messages (only available with the {@link TestAdapter}).
   * @async
   * @param {string[]} userMessages - the user messages
   * @returns {Promise.<void>}
   */
  async play(userMessages) {
    logger.debug('play', userMessages);
    try {
      await this.init();
      await this.adapter.play(userMessages);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Responds to the user.
   * @async
   * @param {object} userMessage - the user message
   * @returns {Promise.<void>}
   */
  async respond(userMessage) {
    logger.debug('respond', userMessage);
    switch (userMessage.type) {
      case 'postback':
        return this.respondWhenPostback(userMessage);
      case 'image':
        return this.respondWhenImage(userMessage);
      case 'text':
      default:
        return this.respondWhenText(userMessage);
    }
  }

  /**
   * Computes the responses for a user message of type text.
   * @async
   * @private
   * @param {object} userMessage - the user text message
   * @returns {Promise.<void>}
   */
  async respondWhenText(userMessage) {
    logger.debug('respondWhenText', userMessage);
    const { intents, entities } = await this.nlu.compute(userMessage.payload.value);
    logger.debug('respondWhenText: intents, entities', intents, entities);
    return this.dm.executeIntents(this.adapter, userMessage.user, intents, entities);
  }

  /**
   * Computes the responses for a user message of type postback.
   * @async
   * @private
   * @param {object} userMessage - the user postback message
   * @returns {Promise.<void>}
   */
  async respondWhenPostback(userMessage) {
    logger.debug('respondWhenPostback', userMessage);
    const dialog = {
      name: userMessage.payload.value.dialog,
      entities: userMessage.payload.value.entities,
    };
    return this.dm.executeDialogs(this.adapter, userMessage.user, [dialog]);
  }

  /**
   * Computes the responses for a user message of type image.
   * @async
   * @private
   * @param {object} userMessage - the user image message
   * @returns {Promise.<void>}
   */
  async respondWhenImage(userMessage) {
    logger.debug('respondWhenImage', userMessage);
    const dialog = {
      name: 'image',
      entities: [{ url: userMessage.payload.value.url }],
    };
    return this.dm.executeDialogs(this.adapter, userMessage.user, [dialog]);
  }
}

module.exports = Bot;
