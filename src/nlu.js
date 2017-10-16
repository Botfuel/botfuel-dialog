const QnA = require('botfuel-qna-sdk');
const CompositeExtractor = require('./extractors/composite_extractor');
const Classifier = require('./classifier');

const fs = require('fs');

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
    this.extractor = new CompositeExtractor(this.getExtractors(`${config.path}/src/extractors`));
    this.classifier = new Classifier(config);
    if (config.qna) {
      this.qna = new QnA({
        appId: process.env.BOTFUEL_APP_ID,
        appKey: process.env.BOTFUEL_APP_KEY,
      });
    }
  }

  getExtractorFiles(path) {
    let files = [];
    if (fs.existsSync(path)) {
      files = dir.files(extractorsPath, { sync: true }) || files;
    }
    return files.filter(file => file.match(/^.*.js$/))
  }

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

  async init() {
    console.log('Nlu.init');
    await this.classifier.init();
  }

  /**
   * Classifies a sentence.
   * @param {string} sentence the sentence
   * @return {Promise} a promise with entities and intents
   */
  async compute(sentence) {
    console.log('Nlu.compute', sentence);
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

  async localCompute(sentence) {
    console.log('Nlu.localCompute', sentence);
    const entities = await this.extractor.compute(sentence);
    console.log('Nlu.localCompute: entities', entities);
    const intents = await this.classifier.compute(sentence, entities);
    console.log('Nlu.localCompute: intents', intents);
    return { intents, entities };
  }

  async qnaCompute(sentence) {
    console.log('Nlu.qnaCompute', sentence);
    const qnas = await this.qna.getMatchingQnas({ sentence });
    console.log('Nlu.compute: qnas', qnas);
    const intents = [{ label: 'qnas_dialog', value: 1.0 }];
    const entities = [{ dim: 'qnas', value: qnas }];
    return { intents, entities };
  }
}

module.exports = Nlu;
