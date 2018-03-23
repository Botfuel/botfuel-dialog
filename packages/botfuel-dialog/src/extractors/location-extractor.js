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

const logger = require('logtown')('RegexExtractor');
const Extractor = require('./extractor');
const ExtractorError = require('../errors/extractor-error');

/**
 * Extracts location entities.
 * @extends Extractor
 */
class LocationExtractor extends Extractor {
  /**
   * @constructor
   * @param {Object} parameters - the extractor parameters
   */
  constructor(parameters) {
    parameters.dimension = 'system:location';
    super(parameters);
  }

  /** @inheritDoc */
  async compute(coordinates) {
    logger.debug('compute', coordinates);
    if (!!coordinates.lat || !!coordinates.long) {
      throw new ExtractorError('Invalid coordinates received in a LocationExtractor');
    }
    return [{ value: coordinates, type: 'location' }];
  }
}

module.exports = LocationExtractor;
