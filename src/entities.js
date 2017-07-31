'use strict';

const Fs = require('fs-promise');

class Entities {
  /**
   * Constructor.
   */
  constructor(config, path) {
    this.config = config;
    this.path = path;
  }

  compute(sentence) {
    console.log("Entities.compute", sentence);
    let extractorsPath = `${ this.path }/scripts/src/controllers/extractors`;
    console.log("Entities.compute: extractorsPath", extractorsPath);
    return Fs
      .readdir(extractorsPath)
      .then((extractors) => {
        // TODO: fix this
        const Extractor = require(`${ extractorsPath }/${ extractors[0] }`);
        return new Extractor()
          .parse(sentence)
          .then((entities) => {
            console.log("Entities.compute: entities", entities);
            return Promise.resolve(entities);
          });
      });
  }
}

module.exports = Entities;
