/* eslint-disable valid-jsdoc */
const Diacritics = require('diacritics');
const logger = require('logtown')('Corpus');

/**
 * Class for handling corpora.
 *
 * A corpus is a matrix of words,
 * structured by grouping on a same line words with similar meanings.
 *
 * | main word | synonym          | other synonym          |
 * | :-------- | :--------------- | :--------------------- |
 * | word1     | synonym of word1 | other synonym of word1 |
 * | word2     | synonym of word2 | other synonym of word2 |
 * | word3     | synonym of word3 | other synonym of word3 |
 *
 */
class Corpus {
  /**
   * @constructor
   * @param {String[][]} matrix - the corpus matrix
   */
  constructor(matrix) {
    logger.debug('constructor', matrix);
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
      sentence = sentence.replace('\'', ' ');
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
   * Checks if two words match when normalized.
   * @static
   * @param {String} word1 - the first word
   * @param {String} word2 - the second word
   * @param {Object} options - the normalization options
   * @returns {boolean} true iff both words match
   */
  static matches(word1, word2, options) {
    logger.debug('matches', word1, word2, options);
    return Corpus.normalize(word1, options) === Corpus.normalize(word2, options);
  }

  /**
   * Gets matching value for a key.
   * @param {String} key - the
   * @param {Object} options - the normalization options
   * @returns {String} the matching value
   */
  getValue(key, options) {
    logger.debug('getValue', key, options);
    for (const row of this.matrix) {
      for (const word of row) {
        if (Corpus.matches(key, word, options)) {
          return row[0];
        }
      }
    }
    return null;
  }

  /**
   * Flattens the matrix of words into a list of words.
   * @returns {String[]} the resulting list of words
   */
  getWords() {
    return this.matrix.reduce((s, t) => s.concat(t));
  }
}

module.exports = Corpus;
