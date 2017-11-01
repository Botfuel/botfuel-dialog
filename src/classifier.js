const Fs = require('fs');
const Natural = require('natural');
const logger = require('logtown')('Classifier');

const INTENT_SUFFIX = '.intent';

/**
 * Classifier
 */
class Classifier {
  /**
   * @constructor
   * @param {object} config - the bot config
   */
  constructor(config) {
    logger.debug('constructor', config);
    this.locale = config.locale;
    this.modelFilename = `${config.path}/models/model.json`;
    this.intentDirname = `${config.path}/src/intents`;
    this.classifier = null;
    this.getStemmer().attach();
  }

  /**
   * Get classifier stemmer for it's locale
   * @returns {*|Stemmer} - the stemmer
   */
  getStemmer() {
    switch (this.locale) {
      case 'fr':
        return Natural.PorterStemmerFr;
      case 'en':
      default:
        return Natural.PorterStemmer;
    }
  }

  /**
   * Init the classifier
   * @returns {Promise}
   */
  async init() {
    logger.debug('init');
    return new Promise((resolve, reject) => {
      Natural
        .LogisticRegressionClassifier
        .load(this.modelFilename, null, (err, classifier) => {
          if (err !== null) {
            return reject(err);
          }
          this.classifier = classifier;
          return resolve();
        });
    });
  }

  /**
   * Compute features for a sentence
   * @param {string} sentence - the sentence
   */
  computeFeatures(sentence) {
    return sentence.tokenizeAndStem();
  }

  /**
   * Classifies a sentence.
   * @param {string} sentence the sentence
   * @return {Promise} a promise with entities and intents
   */
  async compute(sentence, entities) {
    logger.debug('compute', sentence, entities);
    const features = this.computeFeatures(sentence, entities);
    return this.classifier.getClassifications(features);
  }

  /**
   * Train bot model
   * @returns {Promise.<void>}
   */
  async train() {
    logger.debug('train');
    this.classifier = new Natural.LogisticRegressionClassifier(this.getStemmer());
    Fs
      .readdirSync(this.intentDirname, 'utf8')
      .filter(fileName => fileName.substr(-INTENT_SUFFIX.length) === INTENT_SUFFIX)
      .map((fileName) => {
        logger.debug('train: filename', fileName);
        const intent = fileName.substring(0, fileName.length - INTENT_SUFFIX.length);
        logger.debug('train: intent', intent);
        return Fs
          .readFileSync(`${this.intentDirname}/${fileName}`, 'utf8')
          .toString()
          .split('\n')
          .map((line) => {
            logger.debug('train: line', line);
            const features = this.computeFeatures(line, null); // TODO: compute also entities
            logger.debug('train: features', features);
            return this.classifier.addDocument(features, intent);
          });
      });
    logger.debug('train: training');
    this.classifier.train();
    logger.debug('train: trained');
    this.classifier.save(this.modelFilename);
    logger.debug('train: saved');
  }
}

module.exports = Classifier;
