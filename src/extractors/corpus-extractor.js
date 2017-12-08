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

const logger = require('logtown')('CorpusExtractor');
const CharFunk = require('charfunk');
const Corpus = require('../corpora/corpus');
const Extractor = require('./extractor');

/**
 * Corpus based extractor.
 * See {@link Corpus}.
 * @extends Extractor
 */
class CorpusExtractor extends Extractor {
  // eslint-disable-next-line require-jsdoc
  async compute(sentence) {
    logger.debug('compute', sentence);
    const normalizedSentence = Corpus.normalize(sentence, this.parameters.options);
    const entities = [];
    for (const row of this.parameters.corpus.matrix) {
      for (const word of row) {
        this
          .findOccurences(normalizedSentence, word)
          .map(index => this.addEntity(entities, {
            dim: this.parameters.dimension,
            body: word,
            values: [this.buildValue(row[0])],
            startIndex: index.startIndex,
            endIndex: index.endIndex,
          }));
      }
    }
    return entities;
  }

  /**
   * Adds an entity to an array of entities.
   * @private
   * @param {Object[]} entities - the array of entities
   * @param {Object} newEntity - the entity
   * @returns {void}
   */
  addEntity(entities, newEntity) {
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      if (newEntity.startIndex <= entity.startIndex
          && newEntity.endIndex >= entity.endIndex) {
        entities.splice(i, 1);
      }
    }
    entities.push(newEntity);
  }

  /**
   * Finds occurences of a word in a sentence.
   * @private
   * @param {String} sentence - the sentence
   * @param {String} word - the word
   * @returns {Object[]} an array of objects, each object contains start and end indices
   */
  findOccurences(sentence, word) {
    logger.debug('extracts', sentence, word);
    const normalizedWord = Corpus.normalize(word, this.parameters.options);
    const results = [];
    for (let startIndex = -1, endIndex = 0; ;) {
      startIndex = sentence.indexOf(normalizedWord, endIndex);
      endIndex = startIndex + normalizedWord.length;
      if (startIndex < 0
          || (startIndex > 0 && CharFunk.isLetterOrDigit(sentence[startIndex - 1]))
          || (endIndex < sentence.length && CharFunk.isLetterOrDigit(sentence[endIndex]))) {
        break;
      }
      results.push({ startIndex, endIndex });
    }
    return results;
  }

  /**
   * Builds the object value from a string.
   * @param {String} value - the string
   * @returns {Object} the object value
   */
  buildValue(value) {
    return { value, type: 'string' };
  }
}

module.exports = CorpusExtractor;
