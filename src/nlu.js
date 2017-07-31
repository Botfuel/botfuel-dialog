'use strict';

const Entities = require('./entities');
const Features = require('./features');
const Natural = require('natural');

/**
 * A nlu module (could be replaced by an external one).
 */
class Nlu {
  /**
   * Constructor.
   */
  constructor(context, config, path) {
    console.log("Nlu.constructor", "<context>", config, path);
    this.context = context; // useful?
    this.config = config;
    this.path = path;
    this.entities = new Entities(config, path);
    this.features = new Features(config, path);
  }

  initClassifierIfNecessary() {
    console.log("Nlu.initClassifierIfNecessary");
    if (this.classifier) {
      console.log("Nlu.initClassifierIfNecessary: already initialized");
      return Promise.resolve();
    } else {
      let model = `${ this.path }/models/${ this.config.modelName }`;
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
  compute(sentence) {
    console.log("Nlu.compute", sentence);
    return this
      .initClassifierIfNecessary()
      .then(() => {
        console.log("Nlu.classifier: initialized");
        return this
          .entities
          .compute(sentence)
          .then((ents) => {
            console.log("Nlu.entities: extracted", ents);
            return this
              .features
              .compute(sentence, ents)
              .then((feats) => {
                let intents = this
                  .classifier
                  .getClassifications(feats);
                console.log("Nlu.classification: intents", intents);
                return Promise.resolve({
                  entities: ents,
                  intents: intents
                });
              })
          })
          .catch((err) => {
            console.log("Nlu.entities: extraction failed", err);
            return Promise.reject(err);
          });
      })
      .catch((err) => {
        console.log("Nlu.classifier: initialization rejected", err);
        return Promise.reject(err);
      });
  }
}

module.exports = Nlu;
