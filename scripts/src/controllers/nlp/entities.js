'use strict';

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
    // TODO: execute entity extractors present in a directory (eg named extractors/)
    if (sentence == 'je pars demain') {
      return Promise.resolve([
        { type: 'date', value: 'demain'}
      ]);
    } else if (sentence == 'je pars a Nantes') {
      return Promise.resolve([
        { type: 'location', value: 'Nantes'}
      ]);
    } else if (sentence == 'je pars demain a Nantes') {
      return Promise.resolve([
        { type: 'date', value: 'demain'},
        { type: 'location', value: 'Nantes'}
      ]);
    } else {
      return Promise.resolve([]);
    }
  }
}

module.exports = Entities;
