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

/* eslint-disable valid-jsdoc */
const Diacritics = require('diacritics');
const ExtractorError = require('../errors/extractor-error');
const logger = require('logtown')('Corpus');

/**
 * Class for handling corpora.
 *
 * A corpus is a list of words.
 * Within a corpus, we group together words sharing a common meaning.
 * Within a subgroup, a specific word is distinguished.
 *
 * A corpus could then be represented by the following table (or matrix) where:
 * - each row contains words sharing a common meaning,
 * - the first word of each row is the distinguished word used to represent the subgroup.
 *
 * | main word | synonym          | another synonym          | yet another synonym          |
 * | :-------- | :--------------- | :----------------------- | :--------------------------- |
 * | word1     | synonym of word1 |                          |                              |
 * | word2     | synonym of word2 | another synonym of word2 | yet another synonym of word2 |
 * | word3     | synonym of word3 | another synonym of word3 |                              |
 *
 * Two specific edge-cases:
 * - a table with a single line is a set of synonyms,
 * - a table with a single column is a set of words without synonyms.
 */
class Corpus {
  /**
   * @constructor
   * @param {String[][]} matrix - the corpus matrix,
   * a row of the matrix corresponds to words with common meaning
   * @param {String} path - the file path
   */
  constructor(matrix, name) {
    logger.debug('constructor', matrix);
    for (const row of matrix) {
      for (const word of row) {
        if (word.length === 0) {
          throw new ExtractorError(`The corpus ${name} is not formatted properly.
           Make sure it doesn’t contain trailing commas.`);
        }
      }
    }
    this.matrix = matrix;
  }

  /**
   * Normalizes a sentence.
   * @static
   * @param {String} sentence - the sentence
   * @param {Object} options - the normalization options
   * @returns {String} the normalized sentence
   */
  static normalize(sentence, options) {
    logger.debug('Corpus.normalize', sentence, options);
    if (options === undefined || options.caseSensitive !== true) {
      sentence = sentence.toLowerCase();
    }
    if (options === undefined || options.keepQuotes !== true) {
      sentence = sentence.replace("'", ' ');
    }
    if (options === undefined || options.keepDashes !== true) {
      sentence = sentence.replace('-', ' ');
    }
    if (options === undefined || options.keepAccents !== true) {
      sentence = Diacritics.remove(sentence);
    }
    return sentence.replace(/ {2,}/g, ' ');
  }

  /**
   * Gets matching value for a key.
   * @param {String} key - the key
   * @param {Object} options - the normalization options
   * @returns {String} the matching value
   */
  getValue(key, options) {
    logger.debug('getValue', key, options);
    const normalizedKey = Corpus.normalize(key, options);
    for (const row of this.matrix) {
      for (const word of row) {
        const normalizedWord = Corpus.normalize(word, options);
        if (normalizedKey === normalizedWord) {
          return row[0];
        }
      }
    }
    return null;
  }
}

module.exports = Corpus;
