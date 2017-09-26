const EntityExtractor = require('./entity_extractor');
const Classifier = require('./classifier');

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
    this.entityExtractor = new EntityExtractor(config);
    this.classifier = new Classifier(config);
  }

  /**
   * Classifies a sentence.
   * @param {string} sentence the sentence
   * @return {Promise} a promise with entities and intents
   */
  async compute(sentence) {
    console.log('Nlu.compute', sentence);
    const entities = await this.entityExtractor.compute(sentence);
    const intents = await this.classifier.compute(sentence, entities);
    console.log('Nlu.compute: intents', intents);
    return { intents, entities };
  }
}

module.exports = Nlu;
