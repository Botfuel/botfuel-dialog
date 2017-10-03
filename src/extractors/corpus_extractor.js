const Corpus = require('../corpora/corpus');

/**
 * Class for extracting entities.
 */
class CorpusExtractor {
  /**
   * Constructor.
   */
  constructor(dim, corpus, options) {
    console.log('CorpusExtractor.constructor', '<corpus>', options);
    this.dim = dim;
    this.corpus = corpus;
    this.options = options;
  }

  /**
   * @param {string} sentence the sentence
   */
  async compute(sentence) {
    console.log('CorpusExtractor.compute', sentence);
    const normalizedSentence = Corpus.normalize(sentence, this.options);
    const entities = [];
    this.computeEntities(normalizedSentence, this.corpus.getWords(), entities);
    return entities;
  }

  getRemainder(sentence, word) {
    console.log('CorpusExtractor.getRemainder', sentence, word);
    const startIndex = sentence.indexOf(word);
    if (startIndex < 0) {
      return null;
    }
    if (startIndex > 0) {
      if (sentence[startIndex - 1] != ' ') {
        return null;
      }
    }
    const endIndex = startIndex + word.length;
    if (endIndex < sentence.length) {
      if (sentence[endIndex] != ' ') {
        return null;
      }
    }
    return sentence.slice(0, startIndex) + sentence.slice(endIndex);
  }
  computeEntities(sentence, words, entities) {
    console.log('CorpusExtractor.computeEntities', sentence, words, entities);
    if (sentence.length > 0) {
      for (const word of words) {
        const normalizedWord = Corpus.normalize(word, this.options);
        const remainder = this.getRemainder(sentence, normalizedWord);
        if (remainder !== null) {
          entities.push({
            dim: this.dim,
            values: [
              {
                value: this.corpus.getValue(normalizedWord, this.options),
                type: 'string',
            },
            ],
          });
          return this.computeEntities(remainder, words, entities);
        }
      }
    }
  }
}

module.exports = CorpusExtractor;
