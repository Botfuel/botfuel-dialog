'use strict';

const EntityExtraction = require('./entity_extraction');
const Natural = require('natural');
const { modelName } = require('./config');

/**
 * A nlu module (could be replaced by an external one).
 */
class Nlu {
  /**
   * Constructor.
   * @param {string} locale the locale
   */
  constructor(context, locale) {
    this.context = context;
    this.entityExtraction = new EntityExtraction(locale);
  }

  initClassifierIfNecessary() {
    console.log("Nlu.initClassifierIfNecessary");
    if (this.classifier) {
      console.log("Nlu.initClassifierIfNecessary: already initialized");
      return Promise.resolve();
    } else {
      let model = `${ __dirname }/../../models/${ modelName }`;
      console.log("Nlu.initClassifierIfNecessary: initializing", model);
      return new Promise((resolve, reject) => {
        Natural
          .LogisticRegressionClassifier
          .load(model, null, (err, classifier) => {
            if (err !== null) {
              return reject(err);
            } else {
              this.classifier = classifier;
              return resolve();
            }
          });
      });
    }
  }

  /**
   * Classifies a sentence.
   * @param {string} sentence the sentence
   * @return {Promise} a promise with entities and intents
   */
  classify(sentence) {
    console.log("Nlu.classify", sentence);
    return this
      .initClassifierIfNecessary()
      .then(() => {
        console.log("Nlu.classify: initialisation resolved");
        return this
          .entityExtraction
          .analyze(sentence)
          .then(({
            entities: entities,
            features: features
          }) => {
            console.log("Nlu.classified: resolved", entities, features);
            let intents = this
              .classifier
              .getClassifications(features);
            console.log("Nlu.classify: intents", intents);
            return Promise.resolve({
              entities: entities,
              intents: intents
            });
          })
          .catch((err) => {
            console.log("Nlu.classified: rejected", err);
            return Promise.reject(err);
          });
      })
      .catch((err) => {
        console.log("Nlu.classified: initialisation rejected", err);
        return Promise.reject(err);
      });
  }
}

module.exports = Nlu;
