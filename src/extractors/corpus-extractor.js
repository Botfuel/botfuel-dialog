const logger = require('logtown')('CorpusExtractor');
const Corpus = require('../corpora/corpus');
const Extractor = require('./extractor');

/**
 * Corpus based extractor.
 */
class CorpusExtractor extends Extractor {
  /**
   * @constructor
   * @param {Object} parameters - the extractor parameters
   */
  constructor(parameters) {
    super();
    this.dimension = parameters.dimension;
    this.corpus = parameters.corpus;
    this.options = parameters.options;
  }

  // eslint-disable-next-line require-jsdoc
  async compute(sentence) {
    logger.debug('compute', sentence);
    const normalizedSentence = Corpus.normalize(sentence, this.options);
    return this.computeEntities(normalizedSentence, this.corpus.getWords(), []);
  }

  /**
   * Gets the remainder of a sentence when removing a word.
   * @param {String} sentence - the sentence
   * @param {String} word - the word
   * @returns {String|null} the remainder
   */
  getRemainder(sentence, word) {
    logger.debug('getRemainder', sentence, word);
    const startIndex = sentence.indexOf(word);
    if (startIndex < 0) {
      return null;
    }
    if (startIndex > 0 && sentence[startIndex - 1] !== ' ') {
      return null;
    }
    const endIndex = startIndex + word.length;
    if (endIndex < sentence.length && sentence[endIndex] !== ' ') {
      return null;
    }
    return sentence.slice(0, startIndex) + sentence.slice(endIndex);
  }

  /**
   * Gets the entity corresponding to a string value.
   * @param {String} value - the value
   * @returns {Object} the entity
   */
  getEntity(value) {
    return { value, type: 'string' };
  }

  /**
   * Recursive method for computing the entities
   * of a sentence corresponding to a list of given words.
   * @param {String} sentence - the sentence
   * @param {String[]} words - the words
   * @param {Object[]} entities - an accumulator for accumulating entities
   * @returns {Object[]} the entities found in the sentence
   */
  computeEntities(sentence, words, entities) {
    logger.debug('computeEntities', sentence, words, entities);
    if (sentence.length > 0) {
      for (const word of words) {
        const normalizedWord = Corpus.normalize(word, this.options);
        const remainder = this.getRemainder(sentence, normalizedWord);
        if (remainder !== null) {
          const value = this.corpus.getValue(normalizedWord, this.options);
          entities.push({
            dim: this.dimension,
            body: word,
            values: [this.getEntity(value)],
          });
          return this.computeEntities(remainder, words, entities);
        }
      }
    }
    return entities;
  }
}

module.exports = CorpusExtractor;
