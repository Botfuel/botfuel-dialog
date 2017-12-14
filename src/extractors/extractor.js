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

const MissingImplementationError = require('../errors/missing-implementation-error');

/**
 * Abstract extractor class.
 */
class Extractor {
  /**
   * @constructor
   * @param {Object} parameters - the extractor parameters
   */
  constructor(parameters) {
    this.parameters = parameters;
  }

  /**
   * Extracts the entities.
   * @abstract
   * @async
   * @param {String} sentence - the sentence
   * @returns {Promise.<Object[]>} an array of extracted entities
   */
  async compute() {
    throw new MissingImplementationError();
  }
}

module.exports = Extractor;
