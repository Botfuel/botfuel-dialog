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

import type { Config } from '../config';
import type { UserMessage, MessageEntities } from '../types';
import type Brain from '../brains/brain';
import type ClassificationResult from '../nlus/classification-result';


export type ComputeContext = {
  brain: Brain,
  userMessage: UserMessage,
};

export type ComputeOutput = {
  classificationResults: ClassificationResult[],
  messageEntities: MessageEntities,
};

const logger = require('logtown')('Nlu');
const MissingImplementationError = require('../errors/missing-implementation-error');

/**
 * Abstract class for a Natural Language Understanding (NLU) module.
 */
class Nlu {
  config: Config;

  /**
   * @constructor
   * @param config - the bot configuration
   */
  constructor(config: Config) {
    logger.debug('constructor', config);
    this.config = config;
  }

  /**
   * Initializes the Nlu module.
   */
  async init(): Promise<void> {
    logger.debug('init');
  }

  /**
   * Computes intents and entities.
   * @param sentence - the sentence
   * @param context - { brain, userMessage }
   */
  async compute(
    sentence: string,
    context: ComputeContext, // eslint-disable-line no-unused-vars
  ): Promise<ComputeOutput> {
    throw new MissingImplementationError();
  }
}

module.exports = Nlu;
