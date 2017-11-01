const Diacritics = require('diacritics');
const logger = require('logtown')('Corpus');

/**
 * Corpus
 */
class Corpus {
  /**
   * @constructor
   * @param {Array.<string[]>} matrix - the corpus matrix
   */
  constructor(matrix) {
    logger.debug('constructor', matrix);
    this.matrix = matrix;
  }

  /**
   * Normalize a sentence
   * @static
   * @param {String} sentence - the sentence
   * @param {Object} options - the normalization options
   * @returns {String} the normalized sentence
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
   * @param {String} key - the key
   * @param {String} word - the word
   * @param {Object} options - the normalization options
   * @returns {boolean} true if match, false else
   */
  static matches(key, word, options) {
    logger.debug('matches', key, word, options);
    return Corpus.normalize(key, options) === Corpus.normalize(word, options);
  }

  /**
   * Get matching value for a key
   * @param {String} key - the key to find
   * @param {Object} options - the normalization options
   * @returns {*} the matching value
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
   * @returns {String[]} the words list
   */
  getWords() {
    return this.matrix.reduce((s, t) => s.concat(t));
  }
}

module.exports = Corpus;
