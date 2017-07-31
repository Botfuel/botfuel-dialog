'use strict';

const EntityExtraction = require('./extractors/entity_extraction');

class Entities {
  /**
   * Constructor.
   * @param {string} locale the locale
   */
  constructor(locale) {
    this.locale = locale;
  }

  compute(sentence) {
    console.log("Entities.compute", sentence);
    // TODO: iterate over extractors
    return new EntityExtraction().parse(sentence);
  }
}

module.exports = Entities;
