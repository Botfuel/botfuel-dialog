const Corpus = require('../corpora/corpus');

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
    console.log('CorpusExtractor.compute', sentence);
    const normalizedSentence = Corpus.normalize(sentence, this.options);
    return this.computeEntities(normalizedSentence, this.corpus.getWords(), []);
  }

  getRemainder(sentence, word) {
    console.log('CorpusExtractor.getRemainder', sentence, word);
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
    console.log('CorpusExtractor.computeEntities', sentence, words, entities);
    if (sentence.length > 0) {
      for (const word of words) {
        const normalizedWord = Corpus.normalize(word, this.options);
        const remainder = this.getRemainder(sentence, normalizedWord);
        if (remainder !== null) {
          const value = this.corpus.getValue(normalizedWord, this.options);
          entities.push({ dim: this.dimension, values: [ this.getEntity(value) ]});
          return this.computeEntities(remainder, words, entities);
        }
      }
    }
    return entities;
  }
}

module.exports = CorpusExtractor;
