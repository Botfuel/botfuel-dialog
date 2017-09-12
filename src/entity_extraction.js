const dir = require('node-dir');

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
  async compute(sentence) {
    console.log('EntityExtraction.compute', sentence);
    const path = `${this.config.path}`/src/extractors;
    const extractorFiles = await dir.promiseFiles(path);
    let entities = [];
    for (const extractorFile of extractorFiles) {
      const Extractor = require(extractorFile);
      const extractor = new Extractor();
      entities = entities.concat(await extractor.compute(sentence));
    }
    return entities;
  }
}

module.exports = EntityExtraction;
