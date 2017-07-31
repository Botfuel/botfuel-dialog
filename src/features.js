'use strict';

const Natural = require('natural');

class Features {
  /**
   * Constructor.
   */
  constructor(config, path) {
    this.config = config;
    this.path = path;
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
