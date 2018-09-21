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
  PostbackMessage,
  ImageMessage,
  TextMessage,
  FileMessage,
  DialogData,
  ErrorObject,
} from './types';
import type { BotMessageJson } from './messages/message';
import type Adapter from './adapters/adapter';
import type Brain from './brains/brain';
import type Nlu from './nlus/nlu';

const Logger = require('logtown');
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
 * - a {@link Nlu} (Natural Language Understanding) module.
 */
class Bot {
  adapter: Adapter;
  brain: Brain;
  config: Config;
  dm: DialogManager;
  middlewareManager: MiddlewareManager;
  nlu: Nlu;

  constructor(config: RawConfig) {
    logger.debug('constructor', { config });
    this.config = getConfiguration(config);
    logger.debug('constructor', { config: this.config });
    checkCredentials(this.config);
    this.brain = new BrainResolver(this).resolve(this.config.brain.name);
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
    logger.debug('init');
    await this.brain.init();
    await this.nlu.init();
  }

  /**
   * Runs the bot.
   */
  async run(): Promise<void> {
    logger.debug('run');
    await this.init();
    await this.adapter.run();
  }

  /**
   * Plays user messages (only available with the TestAdapter).
   */
  async play(userMessages: UserMessage[]): Promise<void> {
    logger.debug('play', { userMessages });
    await this.init();
    await this.adapter.play(userMessages);
  }

  /**
   * Cleans the bot brain.
   */
  async clean(): Promise<void> {
    logger.debug('clean');
    await this.brain.init();
    await this.brain.clean();
  }

  /**
   * Handles a user message.
   */
  async handleMessage(userMessage: UserMessage): Promise<BotMessageJson[]> {
    logger.debug('handleMessage', { userMessage });
    try {
      const contextIn = {
        user: userMessage.user,
        brain: this.brain,
        userMessage,
        config: this.config,
      };
      let botMessages: BotMessageJson[] = [];
      await this.middlewareManager.in(contextIn, async () => {
        logger.debug('handleMessage: responding');
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
    } catch (error) {
      logger.debug('handleMessage: catching', { error });
      return this.respondWhenError(userMessage, error);
    }
  }

  /**
   * Responds to the user.
   */
  async respond(userMessage: UserMessage): Promise<BotMessageJson[]> {
    logger.debug('respond', { userMessage });
    switch (userMessage.type) {
      case 'postback':
        return this.respondWhenPostback(userMessage);
      case 'image':
        return this.respondWhenImage(userMessage);
      case 'file':
        return this.respondWhenFile(userMessage);
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
    logger.debug('respondWhenText', { userMessage });
    // If text input is too long then trigger the complex-input dialog
    if (userMessage.payload.value.length > 256) {
      logger.error('respondWhenText: input is too long.');
      const complexInputDialog: DialogData = {
        name: 'complex-input',
        data: {},
      };
      return this.dm.executeDialog(userMessage, complexInputDialog);
    }
    const { classificationResults, messageEntities } = await this.nlu.compute(
      userMessage.payload.value,
      {
        brain: this.brain,
        userMessage,
      },
    );
    logger.debug('respondWhenText: classificationResults', classificationResults, messageEntities);
    return this.dm.executeClassificationResults(
      userMessage,
      classificationResults,
      messageEntities,
    );
  }

  /**
   * Computes the responses for a user message of type postback.
   * @private
   */
  async respondWhenPostback(userMessage: PostbackMessage): Promise<BotMessageJson[]> {
    logger.debug('respondWhenPostback', { userMessage });
    const dialog = {
      name: userMessage.payload.value.name,
      data: {
        messageEntities: userMessage.payload.value.data.messageEntities,
      },
    };
    return this.dm.executeDialog(userMessage, dialog);
  }

  /**
   * Computes the responses for a user message of type image.
   * @private
   */
  async respondWhenImage(userMessage: ImageMessage): Promise<BotMessageJson[]> {
    logger.debug('respondWhenImage', { userMessage });
    const dialog: DialogData = {
      name: 'image',
      data: {
        url: userMessage.payload.value,
      },
    };
    return this.dm.executeDialog(userMessage, dialog);
  }

  /**
   * Computes the responses for a user message of type file.
   * @private
   */
  async respondWhenFile(userMessage: FileMessage): Promise<BotMessageJson[]> {
    logger.debug('respondWhenFile', { userMessage });
    const dialog: DialogData = {
      name: 'file',
      data: {
        url: userMessage.payload.value,
      },
    };
    return this.dm.executeDialog(userMessage, dialog);
  }


  async respondWhenError(userMessage: UserMessage, error: ErrorObject): Promise<BotMessageJson[]> {
    logger.debug('respondWhenError', { userMessage, error });
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
    const keys = Object.getOwnPropertyNames(error);
    // error is not a standard JS Object so we have to copy each property
    // one by one
    const errorObject = keys.reduce(
      (obj, key) => ({
        ...obj,
        [key]: error[key],
      }),
      {},
    );
    const catchDialog = {
      name: 'catch',
      data: {
        error: errorObject,
      },
    };
    return this.dm.executeDialog(userMessage, catchDialog);
  }
}

module.exports = Bot;
