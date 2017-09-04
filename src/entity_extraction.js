const Fs = require('fs-promise');

/**
 * Class for extracting entities.
 */
class EntityExtraction {
  /**
   * Constructor.
   * @param {Object} config the bot's config
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * Extracts the entities by applying extractors defined at the bot level.
   * @param {string} sentence the sentence
   */
  compute(sentence) {
    console.log('EntityExtraction.compute', sentence);
    console.log('EntityExtraction.compute', this.config.extractors);
    for (const extractor of this.config.extractors) {
      // TODO: fix this
      console.log(extractor);
      return extractor(sentence)
        .then((entities) => {
          console.log('EntityExtraction.compute: entities', entities);
          return Promise.resolve(entities);
        });
    }
  }
}

module.exports = EntityExtraction;
