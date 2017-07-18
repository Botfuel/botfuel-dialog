'use strict';

const Natural = require('natural');

class Features {
  /**
   * Constructor.
   * @param {string} locale the locale
   */
  constructor(locale) {
    this.locale = locale;
    // TODO: fix this
    Natural
      .PorterStemmerFr
      .attach();
  }

  // because of train.js which needs some fixing!
  computeSync(sentence, entities) {
    console.log("Features.computeSync", sentence, entities);
    return sentence.tokenizeAndStem();
  }

  compute(sentence, entities) {
    console.log("Features.compute", sentence, entities);
    return Promise.resolve(this.computeSync(sentence, entities));
  }
}

module.exports = Features;
