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

const logger = require('logtown')('CompositeExtractor');
const Extractor = require('./extractor');

/**
 * Composite extractor used for combining extractors.
 */
class CompositeExtractor extends Extractor {
  // eslint-disable-next-line require-jsdoc
  async compute(sentence) {
    logger.debug('compute', sentence);


    // Prepare all async compute functions
    const promises = [];
    for (let i = 0; i < this.parameters.extractors.length; i += 1) {
      if (this.parameters.extractors[i].parameters.options
        && this.parameters.extractors[i].parameters.options.useRawSentence) {
        if (typeof sentence !== 'object') {
          throw new Error('CompositeExtractor: spellchecking have to be enabled into bot\'s configuration');
        }
        logger.debug('CompositeExtractor compute: using raw sentence');
        promises.push(this.parameters.extractors[i].compute(sentence.raw || sentence));
      } else {
        logger.debug('CompositeExtractor compute: using spell-checked sentence');
        promises.push(this.parameters.extractors[i].compute(sentence.spellchecked || sentence));
      }
    }

    // Execute in parallel async compute functions
    const promisesResults = await Promise.all(promises);

    // Build entities array
    let entities = [];
    for (let i = 0; i < promisesResults.length; i += 1) {
      entities = entities.concat(promisesResults[i]);
    }

    return entities;
  }
}

module.exports = CompositeExtractor;
