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
    console.log('EntityExtraction.constructor', config);
    this.config = config;
    const path = `${config.path}/src/extractors`;
    this.files = dir.files(path, { sync: true });
    console.log('EntityExtraction.constructor: files', this.files);
  }

  /**
   * Extracts the entities by applying extractors defined at the bot level.
   * @param {string} sentence the sentence
   */
  async compute(sentence) {
    console.log('EntityExtraction.compute', sentence);
    let entities = [];
    for (const file of this.files) {
      const Extractor = require(file);
      const extractor = new Extractor();
      entities = entities.concat(await extractor.compute(sentence));
    }
    return entities;
  }
}

module.exports = EntityExtraction;
