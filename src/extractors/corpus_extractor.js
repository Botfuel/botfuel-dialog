/**
 * Class for extracting entities.
 */
class CorpusExtractor {
  /**
   * Constructor.
   */
  constructor(corpus, options) {
    console.log('CorpusExtractor.constructor', '<corpus>', options);
    this.corpus = corpus;
    this.options = options;
  }

  /**
   * @param {string} sentence the sentence
   */
  async compute(sentence) {
    console.log('CorpusExtractor.compute', sentence);
    const entities = null;
    return entities;
  }
}

module.exports = EntityExtractor;
