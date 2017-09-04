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
    const extractorsPath = `${this.config.path}/scripts/src/controllers/extractors`;
    console.log('EntityExtraction.compute: extractorsPath', extractorsPath);
    return Fs
      .readdir(extractorsPath)
      .then((extractors) => {
        // TODO: fix this
        // TODO: move extractors in config
        const Extractor = require(`${extractorsPath}/${extractors[0]}`);
        return new Extractor()
          .parse(sentence)
          .then((entities) => {
            console.log('EntityExtraction.compute: entities', entities);
            return Promise.resolve(entities);
          });
      });
  }
}

module.exports = EntityExtraction;
