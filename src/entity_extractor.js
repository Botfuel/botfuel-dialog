const dir = require('node-dir');

/**
 * Class for extracting entities.
 */
class EntityExtractor {
  /**
   * Constructor.
   * @param {Object} config the bot's config
   */
  constructor(config) {
    console.log('EntityExtractor.constructor', config);
    this.config = config;
    const path = `${config.path}/src/extractors`;
    console.log('EntityExtractor.constructor: path', path);
    this.files = dir
      .files(path, { sync: true })
      .filter(file => file.match(/^.*.js$/));
    console.log('EntityExtractor.constructor: files', this.files);
  }

  /**
   * Extracts the entities by applying extractors defined at the bot level.
   * @param {string} sentence the sentence
   */
  async compute(sentence) {
    console.log('EntityExtractor.compute', sentence);
    let entities = [];
    for (const file of this.files) {
      const Extractor = require(file);
      // we want to keep the order to ease the testability
      // eslint-disable-next-line no-await-in-loop
      const extractorEntities = await new Extractor().compute(sentence);
      console.log('EntityExtractor.compute: extractorEntities', file, extractorEntities);
      entities = entities.concat(extractorEntities);
    }
    return entities;
  }
}

module.exports = EntityExtractor;
