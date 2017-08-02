const Natural = require('natural');
const EntityExtraction = require('./entity_extraction');
const FeatureExtraction = require('./feature_extraction');

/**
 * A nlu module (could be replaced by an external one).
 */
class Nlu {
  /**
   * Constructor.
   */
  constructor(context, config, path) {
    console.log('Nlu.constructor', '<context>', config, path);
    this.context = context; // useful?
    this.config = config;
    this.path = path;
    this.entityExtraction = new EntityExtraction(config, path);
    this.featureExtraction = new FeatureExtraction(config, path);
  }

  initClassifierIfNecessary() {
    console.log('Nlu.initClassifierIfNecessary');
    if (this.classifier) {
      console.log('Nlu.initClassifierIfNecessary: already initialized');
      return Promise.resolve();
    }
    const model = `${this.path}/models/${this.config.modelName}`;
    console.log('Nlu.initClassifierIfNecessary: initializing', model);
    return new Promise((resolve, reject) => {
      Natural
        .LogisticRegressionClassifier
        .load(model, null, (err, classifier) => {
          if (err !== null) {
            return reject(err);
          }
          this.classifier = classifier;
          return resolve();
        });
    });
  }

  /**
   * Classifies a sentence.
   * @param {string} sentence the sentence
   * @return {Promise} a promise with entities and intents
   */
  compute(sentence) {
    console.log('Nlu.compute', sentence);
    return this
      .initClassifierIfNecessary()
      .then(() => {
        console.log('Nlu.classifier: initialized');
        return this
          .entityExtraction
          .compute(sentence)
          .then((entities) => {
            console.log('Nlu.entities: extracted', entities);
            return this
              .featureExtraction
              .compute(sentence, entities)
              .then((features) => {
                const intents = this
                  .classifier
                  .getClassifications(features);
                console.log('Nlu.classification: intents', intents);
                return Promise.resolve({ entities, intents });
              });
          })
          .catch((err) => {
            console.log('Nlu.entities: extraction failed', err);
            return Promise.reject(err);
          });
      })
      .catch((err) => {
        console.log('Nlu.classifier: initialization rejected', err);
        return Promise.reject(err);
      });
  }
}

module.exports = Nlu;
