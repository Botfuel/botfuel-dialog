const Diacritics = require('diacritics');
const logger = require('logtown')('Corpus');

/**
 * Corpus
 */
class Corpus {
  /**
   * @constructor
   * @param {string[][]} matrix - the corpus matrix
   */
  constructor(matrix) {
    logger.debug('constructor', matrix);
    this.matrix = matrix;
  }

  /**
   * Normalize a sentence
   * @static
   * @param {string} sentence - the sentence
   * @param {object} options - the normalization options
   * @return {string} the normalized sentence
   */
  static normalize(sentence, options) {
    // logger.debug('Corpus.normalize', sentence, options);
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
   * Check if a normalized key and word match together
   * @static
   * @param {string} key - the key
   * @param {string} word - the word
   * @param {object} options - the normalization options
   * @return {boolean} true if match, false else
   */
  static matches(key, word, options) {
    logger.debug('matches', key, word, options);
    return Corpus.normalize(key, options) === Corpus.normalize(word, options);
  }

  /**
   * Get matching value for a key
   * @param {string} key - the key to find
   * @param {object} options - the normalization options
   * @return {*} the matching value
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
   * Transform matrix of words into list of words
   * @return {string[]} the words list
   */
  getWords() {
    return this.matrix.reduce((s, t) => s.concat(t));
  }
}

module.exports = Corpus;
