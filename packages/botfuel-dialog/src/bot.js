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
const Spellchecking = require('botfuel-nlp-sdk').Spellchecking;
const AdapterResolver = require('./adapter-resolver');
const BrainResolver = require('./brain-resolver');
const NluResolver = require('./nlu-resolver');
const DialogManager = require('./dialog-manager');
const { getConfiguration } = require('./config');
const AuthenticationError = require('./errors/authentication-error');
const DialogError = require('./errors/dialog-error');
const ResolutionError = require('./errors/resolution-error');
const { checkCredentials } = require('./utils/environment');

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
    checkCredentials(this.config);
    this.brain = new BrainResolver(this).resolve(this.config.brain.name);
    this.spellchecking = null;
    this.nlu = new NluResolver(this).resolve(this.config.nlu.name);
    this.dm = new DialogManager(this.brain, this.config);
    this.adapter = new AdapterResolver(this).resolve(this.config.adapter.name);
  }

  /**
   * Initializes the bot.
   * @async
   * @private
   * @returns {Promise.<void>}
   */
  async init() {
    // Brain
    await this.brain.init();
    // NLU
    await this.nlu.init();
    // Spellchecking
    if (this.config.spellchecking) {
      if (!process.env.BOTFUEL_APP_ID || !process.env.BOTFUEL_APP_KEY) {
        logger.error(
          'BOTFUEL_APP_ID and BOTFUEL_APP_KEY are required for using the spellchecking service!',
        );
      }
      this.spellchecking = new Spellchecking({
        appId: process.env.BOTFUEL_APP_ID,
        appKey: process.env.BOTFUEL_APP_KEY,
      });
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
    } else if (error instanceof ResolutionError) {
      logger.error(`Could not resolve '${error.name}'`);
    } else if (error instanceof DialogError) {
      logger.error(`Could not execute dialog '${error.name}'`);
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
    let sentence = userMessage.payload.value;
    if (this.config.spellchecking) {
      sentence = (await this.spellcheck(sentence, this.config.spellchecking)).correctSentence;
    }
    const { classificationResults, messageEntities } = await this.nlu.compute(sentence, {
      brain: this.brain,
      userMessage,
    });

    logger.debug('respondWhenText: classificationResults', classificationResults, messageEntities);
    await this.dm.executeClassificationResults(
      this.adapter,
      userMessage,
      classificationResults,
      messageEntities,
    );
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
      data: { messageEntities: userMessage.payload.value.entities },
    };
    await this.dm.executeDialog(this.adapter, userMessage, dialog);
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
      data: { url: userMessage.payload.value },
    };
    await this.dm.executeDialog(this.adapter, userMessage, dialog);
  }

  /**
   * Spellchecks a sentence.
   * @param {String} sentence - a sentence
   * @param {String} key - a dictionary key
   * @returns {Object} the spellchecking result
   */
  async spellcheck(sentence, key) {
    logger.debug('spellcheck', sentence, key);
    try {
      const result = await this.spellchecking.compute({ sentence, key });
      logger.debug('spellcheck: result', result);
      return result;
    } catch (error) {
      logger.error('spellcheck: error');
      if (error.statusCode === 403) {
        throw new AuthenticationError();
      }
      throw error;
    }
  }
}

module.exports = Bot;
