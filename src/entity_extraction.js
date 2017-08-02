const Fs = require('fs-promise');

class EntityExtraction {
  /**
   * Constructor.
   */
  constructor(config, path) {
    this.config = config;
    this.path = path;
  }

  compute(sentence) {
    console.log('EntityExtraction.compute', sentence);
    const extractorsPath = `${this.path}/scripts/src/controllers/extractors`;
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
