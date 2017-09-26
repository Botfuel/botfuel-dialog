const QnA = require('botfuel-qna-sdk');
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
    this.entityExtractor = new EntityExtractor(config);
    this.classifier = new Classifier(config);
    if (config.qna) {
      this.qna = new QnA({
        appId: process.env.BOTFUEL_APP_ID,
        appKey: process.env.BOTFUEL_APP_KEY,
      });
    }
  }

  /**
   * Classifies a sentence.
   * @param {string} sentence the sentence
   * @return {Promise} a promise with entities and intents
   */
  async compute(sentence) {
    console.log('Nlu.compute', sentence);
    const entities = await this.entityExtractor.compute(sentence);
    console.log('Nlu.compute: entities', entities);
    const intents = await this.classifier.compute(sentence, entities);
    console.log('Nlu.compute: intents', intents);
    if (this.qna !== undefined) {
      //  console.log(await this.qna.getBotPrediction({ sentence }));
    }
    return { intents, entities };
  }
}

module.exports = Nlu;
