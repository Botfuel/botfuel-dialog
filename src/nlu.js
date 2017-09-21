const Natural = require('natural');
const EntityExtraction = require('./entity_extraction');
const FeatureExtraction = require('./feature_extraction');

/**
 * A nlu module (could be replaced by an external one).
 */
class Nlu {
  /**
   * Constructor.
   * @param {Object} config the bot's config
   */
  constructor(config) {
    // console.log('Nlu.constructor');
    this.config = config;
    this.entityExtraction = new EntityExtraction(config);
    this.featureExtraction = new FeatureExtraction(config);
    // in the case of QnA with need a special classifier
  }

  // TODO: what is the best way to do inits at startup
  initClassifierIfNecessary() {
    console.log('Nlu.initClassifierIfNecessary');
    if (this.classifier) {
      console.log('Nlu.initClassifierIfNecessary: already initialized');
      return Promise.resolve();
    }
    const model = `${this.config.path}/models/model.json`;
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
  async compute(sentence) {
    console.log('Nlu.compute', sentence);
    try {
      await this.initClassifierIfNecessary();
      const entities = await this.entityExtraction.compute(sentence);
      const features = await this.featureExtraction.compute(sentence, entities)
      // in the case of QnA:
      // - the classifier returns a QnA intent
      // - the entityExtraction extracts the QnA id
      const intents = await this.classifier.getClassifications(features);
      console.log('Nlu.compute: intents', intents);
      return { entities, intents };
    } catch(err) {
      console.error('Nlu.compute : initialization rejected', err);
      throw err;
    }
  }
}

module.exports = Nlu;
