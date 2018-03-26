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
const RegexExtractor = require('./regex-extractor');

/**
 * Extracts location entities.
 * @extends Extractor
 */
class LocationExtractor extends RegexExtractor {
  /**
   * @constructor
   * @param {Object} [parameters] - the extractor parameters
   */
  constructor(parameters = {}) {
    parameters.dimension = 'system:location';
    parameters.regex = /([-+]?)([\d]{1,2})((\.)(\d+)(,))(\s*)(([-+]?)([\d]{1,3})((\.)(\d+))?)/g;
    super(parameters);
  }

  /** @inheritDoc */
  buildValue(value) {
    logger.debug('buildValue', value);
    const coordinates = value[0].split(',');
    return { value: { lat: coordinates[0], long: coordinates[1].trim() }, type: 'coordinates' };
  }
}

module.exports = LocationExtractor;
