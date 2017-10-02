const Fs = require('fs');
const Natural = require('natural');

const INTENT_SUFFIX = '.intent';

class Classifier {
  /**
   * Constructor.
   * @param {Object} config the bot's config
   */
  constructor(config) {
    console.log('Classifier.constructor', config);
    this.locale = config.locale;
    this.modelFilename = `${config.path}/models/model.json`;
    this.intentDirname = `${config.path}/src/data/intents`;
    this.classifier = null;
    this.getStemmer().attach();
  }

  getStemmer() {
    switch (this.locale) {
      case 'fr':
        return Natural.PorterStemmerFr;
      case 'en':
      default:
        return Natural.PorterStemmerEn;
    }
  }

  async init() {
    console.log('Classifier.init');
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

  computeFeatures(sentence) {
    return sentence.tokenizeAndStem();
  }

  /**
   * Classifies a sentence.
   * @param {string} sentence the sentence
   * @return {Promise} a promise with entities and intents
   */
  async compute(sentence, entities) {
    console.log('Classifier.compute', sentence, entities);
    const features = this.computeFeatures(sentence, entities);
    return this.classifier.getClassifications(features);
  }

  async train() {
    console.log('Classifier.train');
    this.classifier = new Natural.LogisticRegressionClassifier(this.getStemmer());
    Fs
      .readdirSync(this.intentDirname, 'utf8')
      .filter(fileName => fileName.substr(-INTENT_SUFFIX.length) === INTENT_SUFFIX)
      .map((fileName) => {
        console.log('Classifier.train: filename', fileName);
        const intent = fileName.substring(0, fileName.length - INTENT_SUFFIX.length);
        console.log('Classifier.train: intent', intent);
        return Fs
          .readFileSync(`${this.intentDirname}/${fileName}`, 'utf8')
          .toString()
          .split('\n')
          .map((line) => {
            console.log('Classifier.train: line', line);
            const features = this.computeFeatures(line, null); // TODO: compute also entities
            console.log('Classifier.train: features', features);
            return this.classifier.addDocument(features, intent);
          });
      });
    console.log('Classifier.train: training');
    this.classifier.train();
    console.log('Classifier.train: trained');
    this.classifier.save(this.modelFilename);
    console.log('Classifier.train: saved');
  }
}

module.exports = Classifier;
