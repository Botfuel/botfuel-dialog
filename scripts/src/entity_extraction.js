'use strict';

const Natural = require('natural');

/**
 * Entity extraction.
 */
class EntityExtraction {
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
  computeFeaturesSync(sentence) {
    console.log("EntityExtraction.computeFeaturesSync", sentence);
    return sentence.tokenizeAndStem();
  }

  computeFeatures(sentence) {
    console.log("EntityExtraction.computeFeatures", sentence);
    return Promise.resolve(this.computeFeaturesSync(sentence));
  }

  computeEntities(sentence) {
    console.log("EntityExtraction.computeEntities", sentence);
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

  /**
   * Analyzes a sentence.
   * @param {string} sentence the sentence
   * @return {Promise} a promise with entities and features
   */
  analyze(sentence) {
    console.log("EntityExtraction.analyze", sentence);
    return this
      .computeFeatures(sentence)
      .then((features) => {
        console.log("EntityExtraction.analyze: features", features);
        return this
          .computeEntities(sentence)
          .then((entities) => {
            console.log("EntityExtraction.analyze", entities, features);
            return Promise.resolve({ entities: entities, features: features });
          })
          .catch((err) => {
            console.log("EntityExtraction.analyze: entities computation rejected", err);
            return Promise.reject(err);
          });
      })
      .catch((err) => {
        console.log("EntityExtraction.analyze: features computation rejected", err);
        return Promise.reject(err);
      });
  }
}

module.exports = EntityExtraction;
