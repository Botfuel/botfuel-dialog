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

// @flow

import type { Config, RawConfig } from './config';
import type {
  UserMessage,
  PostbackMessage, ImageMessage, TextMessage,
  DialogData,
} from './types';
import type { BotMessageJson } from './messages/message';
import type Adapter from './adapters/adapter';
import type Brain from './brains/brain';
import type Nlu from './nlus/nlu';

const Logger = require('logtown');
const { Spellchecking } = require('botfuel-nlp-sdk');
const AdapterResolver = require('./adapter-resolver');
const BrainResolver = require('./brain-resolver');
const NluResolver = require('./nlu-resolver');
const DialogManager = require('./dialog-manager');
const { getConfiguration } = require('./config');
const AuthenticationError = require('./errors/authentication-error');
const DialogError = require('./errors/dialog-error');
const ResolutionError = require('./errors/resolution-error');
const { checkCredentials } = require('./utils/environment');
const MiddlewareManager = require('./middleware-manager');

const logger = Logger.getLogger('Bot');

/**
 * This is the bot main class that ties all the components together.
 *
 * A bot has :
 * - an {@link Adapter},
 * - a {@link Brain},
 * - a {@link Config},
 * - a {@link DialogManager},
 * - a {@link MiddlewareManager},
 * - a {@link Nlu} (Natural Language Understanding) module,
 * - an optional {@link Spellchecking} module.
 */
class Bot {
  adapter: Adapter;
  brain: Brain;
  config: Config;
  dm: DialogManager;
  middlewareManager: MiddlewareManager;
  nlu: Nlu;
  spellchecking: ?Spellchecking;

  constructor(config: RawConfig) {
    this.config = getConfiguration(config);
    logger.debug('constructor', this.config);
    checkCredentials(this.config);
    this.brain = new BrainResolver(this).resolve(this.config.brain.name);
    this.spellchecking = null;
    this.nlu = new NluResolver(this).resolve(this.config.nlu.name);
    this.dm = new DialogManager(this);
    this.adapter = new AdapterResolver(this).resolve(this.config.adapter.name);
    this.middlewareManager = new MiddlewareManager(this);
  }

  /**
   * Initializes the bot.
   * @private
   */
  async init(): Promise<void> {
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
   * Handles errors. Adds a user friendly message to common errors.
   */
  handleError(error: Error): void {
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
   */
  async run(): Promise<void> {
    logger.debug('run');
    try {
      await this.init();
      await this.adapter.run();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Plays user messages (only available with the TestAdapter).
   */
  async play(userMessages: UserMessage[]): Promise<void> {
    logger.debug('play', userMessages);
    try {
      await this.init();
      await this.adapter.play(userMessages);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Cleans the bot brain.
   */
  async clean(): Promise<void> {
    logger.debug('clean');
    try {
      await this.brain.init();
      await this.brain.clean();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Handles a user message.
   */
  async handleMessage(userMessage: UserMessage): Promise<BotMessageJson[]> {
    let botMessages: BotMessageJson[] = [];

    logger.debug('handleMessage', userMessage);

    const contextIn = {
      user: userMessage.user,
      brain: this.brain,
      userMessage,
      config: this.config,
    };

    await this.middlewareManager.in(contextIn, async () => {
      botMessages = await this.respond(userMessage);
    });

    const contextOut = {
      user: userMessage.user,
      brain: this.brain,
      botMessages,
      config: this.config,
      userMessage,
    };
    await this.middlewareManager.out(contextOut, async () => {});

    return botMessages;
  }

  /**
   * Responds to the user.
   */
  async respond(userMessage: UserMessage): Promise<BotMessageJson[]> {
    logger.debug('respond', userMessage);

    // TODO Replace Conditional with Polymorphism (Fowler)
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
   * @private
   */
  async respondWhenText(userMessage: TextMessage): Promise<BotMessageJson[]> {
    logger.debug('respondWhenText', userMessage);
    let sentence = userMessage.payload.value;
    sentence = await this.spellcheck(sentence);

    const { classificationResults, messageEntities } = await this.nlu.compute(
      sentence,
      {
        brain: this.brain,
        userMessage,
      },
    );

    logger.debug('respondWhenText: classificationResults', classificationResults, messageEntities);
    const botMessages = await this.dm.executeClassificationResults(
      userMessage,
      classificationResults,
      messageEntities,
    );
    return botMessages;
  }

  /**
   * Computes the responses for a user message of type postback.
   * @private
   */
  async respondWhenPostback(userMessage: PostbackMessage): Promise<BotMessageJson[]> {
    logger.debug('respondWhenPostback', userMessage);
    const dialog = {
      name: userMessage.payload.value.dialog,
      data: {
        messageEntities: userMessage.payload.value.entities,
      },
    };
    const botMessages = await this.dm.executeDialog(userMessage, dialog);
    return botMessages;
  }

  /**
   * Computes the responses for a user message of type image.
   * @private
   */
  async respondWhenImage(userMessage: ImageMessage): Promise<BotMessageJson[]> {
    logger.debug('respondWhenImage', userMessage);
    const dialog: DialogData = {
      name: 'image',
      data: {
        url: userMessage.payload.value,
      },
    };
    const botMessages = await this.dm.executeDialog(userMessage, dialog);
    return botMessages;
  }

  /**
   * Spellchecks a sentence.
   * @param sentence - a sentence
   * @returns the spellchecked sentence
   */
  async spellcheck(sentence: string): Promise<string> {
    const key = this.config.spellchecking;

    logger.debug('spellcheck', sentence, key);

    if (!key || !this.spellchecking) {
      return sentence;
    }

    try {
      const result = await this.spellchecking.compute({ sentence, key });
      logger.debug('spellcheck: result', result);
      return result.correctSentence;
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
