const fs = require('fs');
const dir = require('node-dir');
const QnA = require('botfuel-qna-sdk');
const logger = require('logtown')('Nlu');
const Classifier = require('./classifier');
const BooleanExtractor = require('./extractors/boolean_extractor');
const CompositeExtractor = require('./extractors/composite_extractor');

/**
 * Nlu
 * @class
 * @classdesc A nlu module (could be replaced by an external one).
 * @param {object} config - the bot's config
 */
class Nlu {
  constructor(config) {
    // logger.debug('constructor');
    this.config = config;
    this.extractor = new CompositeExtractor(this.getExtractors(`${config.path}/src/extractors`));
    this.classifier = new Classifier(config);
    if (config.qna) {
      this.qna = new QnA({
        appId: process.env.BOTFUEL_APP_ID,
        appKey: process.env.BOTFUEL_APP_KEY,
      });
    }
  }

  /**
   * Get extractor files
   * @param {string} path - extractors path
   * @returns {Array.<string>} - extractor files
   */
  getExtractorFiles(path) {
    let files = [];
    if (fs.existsSync(path)) {
      files = dir.files(path, { sync: true }) || files;
    }
    return files.filter(file => file.match(/^.*.js$/));
  }

  /**
   * Get extractors
   * @param {string} path - extractors path
   * @returns {Array.<*>} - extractors instances
   */
  getExtractors(path) {
    // user extractors
    const extractors = this.getExtractorFiles(path).map((file) => {
      const ExtractorConstructor = require(file);
      return new ExtractorConstructor(ExtractorConstructor.params);
    });
    // system extractors
    extractors.push(new BooleanExtractor({ locale: this.config.locale }));
    return extractors;
  }

  /**
   * Initialize Nlu
   * @returns {Promise.<void>}
   */
  async init() {
    logger.debug('init');
    await this.classifier.init();
  }

  /**
   * Classifies a sentence.
   * @param {string} sentence - the sentence
   * @return {Promise} a promise with entities and intents
   */
  async compute(sentence) {
    logger.debug('compute', sentence);
    if (this.config.qna === 'before') {
      const result = await this.qnaCompute(sentence);
      if (result.entities[0].value.length !== 0) {
        return result;
      }
      return this.localCompute(sentence);
    } else if (this.config.qna === 'after') {
      const result = await this.localCompute(sentence);
      if (result.intents.length !== 0) {
        return result;
      }
      return this.qnaCompute(sentence);
    }
    return this.localCompute(sentence);
  }

  /**
   * Compute local bot intents and entities
   * @param sentence - the user sentence
   * @returns {Promise.<object>}
   */
  async localCompute(sentence) {
    logger.debug('localCompute', sentence);
    const entities = await this.extractor.compute(sentence);
    logger.debug('localCompute: entities', entities);
    const intents = await this.classifier.compute(sentence, entities);
    logger.debug('localCompute: intents', intents);
    return { intents, entities };
  }

  /**
   * Compute qnas intents and entities
   * @param sentence - the user sentence
   * @returns {Promise.<object>}
   */
  async qnaCompute(sentence) {
    logger.debug('qnaCompute', sentence);
    const qnas = await this.qna.getMatchingQnas({ sentence });
    logger.debug('compute: qnas', qnas);
    const intents = [{ label: 'qnas_dialog', value: 1.0 }];
    const entities = [{ dim: 'qnas', value: qnas }];
    return { intents, entities };
  }
}

module.exports = Nlu;
