const Corpus = require('../corpora/corpus');

const logger = require('logtown').getLogger('CorpusExtractor');

/**
 * Class for extracting entities.
 */
class CorpusExtractor {
  /**
   * Constructor.
   */
  constructor(parameters) {
    this.dimension = parameters.dimension;
    this.corpus = parameters.corpus;
    this.options = parameters.options;
  }

  /**
   * @param {string} sentence the sentence
   */
  async compute(sentence) {
    logger.debug('compute', sentence);
    const normalizedSentence = Corpus.normalize(sentence, this.options);
    return this.computeEntities(normalizedSentence, this.corpus.getWords(), []);
  }

  getRemainder(sentence, word) {
    logger.debug('getRemainder', sentence, word);
    const startIndex = sentence.indexOf(word);
    if (startIndex < 0) {
      return null;
    }
    if (startIndex > 0) {
      if (sentence[startIndex - 1] !== ' ') {
        return null;
      }
    }
    const endIndex = startIndex + word.length;
    if (endIndex < sentence.length) {
      if (sentence[endIndex] !== ' ') {
        return null;
      }
    }
    return sentence.slice(0, startIndex) + sentence.slice(endIndex);
  }

  getEntity(value) {
    return { value, type: 'string' };
  }

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
