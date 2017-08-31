const Natural = require('natural');

/**
 * Class for extracting features.
 */
class FeatureExtraction {
  /**
   * Constructor.
   * @param {Object} config the bot's config
   * @param {path} path the path of the bot project
   */
  constructor(config, path) {
    this.config = config;
    this.path = path;
    // TODO: fix this
    Natural
      .PorterStemmerFr
      .attach();
  }

  // because of train.js which needs some fixing!
  computeSync(sentence, entities) {
    console.log('FeatureExtraction.computeSync', sentence, entities);
    return sentence.tokenizeAndStem();
  }

  /**
   * Extracts the features
   * @param {string} sentence the sentence
   * @param {Object[]} entities the entities
   */
  compute(sentence, entities) {
    console.log('FeatureExtraction.compute', sentence, entities);
    return Promise.resolve(this.computeSync(sentence, entities));
  }
}

module.exports = FeatureExtraction;
