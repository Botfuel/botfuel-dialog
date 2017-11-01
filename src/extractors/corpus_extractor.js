const logger = require('logtown')('CorpusExtractor');
const Corpus = require('../corpora/corpus');

/**
 * Extract corpus entities
 */
class CorpusExtractor {
  /**
   * @constructor
   * @param {Object} parameters - the extractor parameters
   */
  constructor(parameters) {
    this.dimension = parameters.dimension;
    this.corpus = parameters.corpus;
    this.options = parameters.options;
  }

  /**
   * Extracts the entities by applying extractors defined at the bot level.
   * @param {String} sentence - the sentence
   * @returns {Promise.<Object[]>}
   */
  async compute(sentence) {
    logger.debug('compute', sentence);
    const normalizedSentence = Corpus.normalize(sentence, this.options);
    return this.computeEntities(normalizedSentence, this.corpus.getWords(), []);
  }

  /**
   * Get the remainder for a word in a sentence
   * @param {String} sentence - the sentence
   * @param {String} word - the word to find
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
   * Get entity
   * @param {*} value - the entity value
   * @returns {Object} the entity
   */
  getEntity(value) {
    return { value, type: 'string' };
  }

  /**
   * Compute entities in a sentence
   * @param {String} sentence - the sentence
   * @param {String[]} words - the words
   * @param {Object[]} entities - the entities
   * @returns {Object[]} the entities
   */
  computeEntities(sentence, words, entities) {
    logger.debug('computeEntities', sentence, words, entities);
    if (sentence.length > 0) {
      for (const word of words) {
        const normalizedWord = Corpus.normalize(word, this.options);
        const remainder = this.getRemainder(sentence, normalizedWord);
        if (remainder !== null) {
          const value = this.corpus.getValue(normalizedWord, this.options);
          entities.push({ dim: this.dimension, values: [this.getEntity(value)] });
          return this.computeEntities(remainder, words, entities);
        }
      }
    }
    return entities;
  }
}

module.exports = CorpusExtractor;
