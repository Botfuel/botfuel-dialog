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

const logger = require('logtown')('Nlu');
const MissingImplementationError = require('../errors/missing-implementation-error');

/**
 * A nlu module (could be replaced by an external one).
 */
class Nlu {
  /**
   * @constructor
   * @param {Object} nluConfig - the NLU configuration (config.nlu)
   */
  constructor(nluConfig) {
    logger.debug('constructor', nluConfig);
    this.nluConfig = nluConfig;
  }

  /**
   * Initializes the Nlu module.
   * @returns {Promise.<void>}
   */
  async init() {
    logger.debug('init');
  }

  /**
   * Computes intents and entities.
   * @param {String} sentence - the sentence
   * @param {Object} [context] - an optional context (brain and userMessage)
   * @returns {Promise} a promise with entities and intents
   */
  async compute() {
    throw new MissingImplementationError();
  }
}

module.exports = Nlu;
