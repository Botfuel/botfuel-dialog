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
const AdapterResolver = require('./adapter-resolver');
const DialogManager = require('./dialog-manager');
const MemoryBrain = require('./brains/memory-brain');
const MongoBrain = require('./brains/mongo-brain');
const Nlu = require('./nlu');
const { getConfiguration } = require('./config');
const AuthenticationError = require('./errors/authentication-error');
const DialogError = require('./errors/dialog-error');
const ViewError = require('./errors/view-error');
const { checkEnvironmentVariables } = require('./utils/environment');

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
    checkEnvironmentVariables();
    this.id = process.env.BOTFUEL_APP_TOKEN;
    this.brain = this.getBrain(this.config.brain);
    this.nlu = new Nlu(this.config);
    this.dm = new DialogManager(this.brain, this.config);
    this.adapter = new AdapterResolver(this).resolve(this.config.adapter);
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
   * Handles errors.
   * @param {Object} error - the error
   * @returns {void}
   */
  handleError(error) {
    if (error instanceof AuthenticationError) {
      logger.error('Botfuel API authentication failed!');
      logger.error(
        'Please check your app’s credentials and that its plan limits haven’t been reached on https://api.botfuel.io',
      );
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
   * Clean the bot brain.
   * @async
   * @returns {Promise.<void>}
   */
  async clean() {
    logger.debug('clean');
    try {
      await this.brain.init();
      await this.brain.clean();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Responds to the user.
   * @async
   * @param {Object} userMessage - the user message
   * @returns {Promise.<void>}
   */
  async respond(userMessage) {
    logger.debug('respond', userMessage);
    switch (userMessage.type) {
      case 'postback':
        await this.respondWhenPostback(userMessage);
        break;
      case 'image':
        await this.respondWhenImage(userMessage);
        break;
      case 'text':
      default:
        await this.respondWhenText(userMessage);
    }
  }

  /**
   * Computes the responses for a user message of type text.
   * @async
   * @private
   * @param {Object} userMessage - the user text message
   * @returns {Promise.<void>}
   */
  async respondWhenText(userMessage) {
    logger.debug('respondWhenText', userMessage);
    const { intents, entities } = await this.nlu.compute(userMessage.payload.value);
    logger.debug('respondWhenText: intents, entities', intents, entities);
    await this.dm.executeIntents(this.adapter, userMessage.user, intents, entities);
  }

  /**
   * Computes the responses for a user message of type postback.
   * @async
   * @private
   * @param {Object} userMessage - the user postback message
   * @returns {void}
   */
  async respondWhenPostback(userMessage) {
    logger.debug('respondWhenPostback', userMessage);
    const dialog = {
      name: userMessage.payload.value.dialog,
      entities: userMessage.payload.value.entities,
    };
    await this.dm.executeDialogs(this.adapter, userMessage.user, [dialog]);
  }

  /**
   * Computes the responses for a user message of type image.
   * @async
   * @private
   * @param {object} userMessage - the user image message
   * @returns {void}
   */
  async respondWhenImage(userMessage) {
    logger.debug('respondWhenImage', userMessage);
    const dialog = {
      name: 'image',
      entities: [{ url: userMessage.payload.value.url }],
    };
    await this.dm.executeDialogs(this.adapter, userMessage.user, [dialog]);
  }
}

module.exports = Bot;
