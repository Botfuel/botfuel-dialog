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
    for (const extractor of this.config.extractors) {
      // TODO: fix this
      return extractor(sentence)
        .then((entities) => {
          return Promise.resolve(entities);
        });
    }
  }
}

module.exports = EntityExtraction;
