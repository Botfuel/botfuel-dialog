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
const ExtractorError = require('../errors/extractor-error');
const Extractor = require('./extractor');

/**
 * Entity extraction regex based extractor.
 */
class RegexExtractor extends Extractor {
  /**
   * @constructor
   * @param {Object} parameters - the extractor parameters
   */
  constructor(parameters) {
    if (!RegexExtractor.hasValidPattern(parameters.regex)) {
      throw new ExtractorError(`the "regex" parameter can't be "${parameters.regex}"`);
    }
    super(parameters);
  }

  /** @inheritDoc */
  async compute(sentence) {
    logger.debug('compute', sentence);
    // ensure regex has global flag to find all matches
    const regex = RegexExtractor.ensureGlobalRegex(this.parameters.regex);
    const entities = [];
    let match;
    /* eslint-disable no-cond-assign */
    while ((match = regex.exec(sentence))) {
      entities.push({
        dim: this.parameters.dimension,
        body: match[0],
        values: [this.buildValue(match)],
        start: match.index,
        end: match.index + match[0].length,
      });
    }
    /* eslint-enable no-cond-assign */
    return entities;
  }

  /**
   * Builds the object value from a match.
   * @param {Object} value - the match
   * @returns {Object} the object value
   */
  buildValue(value) {
    return { value: value[0] };
  }

  /**
   * Ensures the regex have the global flag
   * @static
   * @param {RegExp|*} pattern - the regexp pattern
   * @returns {RegExp} the regexp with the global flag
   */
  static ensureGlobalRegex(pattern) {
    const parts = pattern.toString().split('/');
    const regex = parts.length > 1 ? parts[1] : pattern;
    const flags = parts.length > 1 ? parts[2] : '';
    try {
      return new RegExp(regex, flags.indexOf('g') === -1 ? `g${flags}` : flags);
    } catch (e) {
      throw new ExtractorError(e.message);
    }
  }

  /**
   * Checks if the regexp has a valid pattern
   * @static
   * @param {RegExp|*} regexp - the regexp pattern
   * @returns {boolean} true if pattern is valid
   */
  static hasValidPattern(regexp) {
    const exclusions = [undefined, null, ''];
    return exclusions.indexOf(regexp) === -1;
  }
}

module.exports = RegexExtractor;
