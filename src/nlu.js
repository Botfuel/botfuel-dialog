/**
 * Copyright (c) 2017 - present, Botfuel (https://www.botfuel.io).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fs = require('fs');
const dir = require('node-dir');
const Qna = require('botfuel-qna-sdk');
const Spellchecking = require('botfuel-nlp-sdk').Spellchecking;
const logger = require('logtown')('Nlu');
const { AuthenticationError } = require('./errors');
const Classifier = require('./classifier');
const BooleanExtractor = require('./extractors/boolean-extractor');
const CompositeExtractor = require('./extractors/composite-extractor');

/**
 * A nlu module (could be replaced by an external one).
 */
class Nlu {
  /**
   * @constructor
   * @param {Object} config - the bot config
   */
  constructor(config) {
    logger.debug('constructor', config);
    this.config = config;
    this.extractor = new CompositeExtractor({
      extractors: this.getExtractors(`${config.path}/src/extractors`),
    });
    this.classifier = new Classifier(config);
    if (config.qna) {
      if (process.env.BOTFUEL_APP_ID === undefined
          || process.env.BOTFUEL_APP_ID === ''
          || process.env.BOTFUEL_APP_KEY === undefined
          || process.env.BOTFUEL_APP_KEY === '') {
        logger.error('BOTFUEL_APP_ID and BOTFUEL_APP_KEY are required for using the QnA service!');
      }
      this.qna = new Qna({
        appId: process.env.BOTFUEL_APP_ID,
        appKey: process.env.BOTFUEL_APP_KEY,
      });
    }
    if (config.spellchecking) {
      if (process.env.BOTFUEL_APP_ID === undefined
          || process.env.BOTFUEL_APP_ID === ''
          || process.env.BOTFUEL_APP_KEY === undefined
          || process.env.BOTFUEL_APP_KEY === '') {
        logger.error('BOTFUEL_APP_ID and BOTFUEL_APP_KEY are required for using the spellchecking service!');
      }
      this.spellchecking = new Spellchecking({
        appId: process.env.BOTFUEL_APP_ID,
        appKey: process.env.BOTFUEL_APP_KEY,
      });
    }
  }

  /**
   * Gets extractor files.
   * @param {String} path - extractors path
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
   * Gets extractors.
   * @param {String} path - extractors path
   * @returns {Array.<*>} - extractor instances
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
   * Initializes the Nlu module
   * @returns {Promise.<void>}
   */
  async init() {
    logger.debug('init');
    await this.classifier.init();
  }

  /**
   * Classifies a sentence.
   * @param {String} sentence - the sentence
   * @returns {Promise} a promise with entities and intents
   */
  async compute(sentence) {
    logger.debug('compute', sentence);
    if (this.config.spellchecking) {
      logger.debug('compute: spellchecking');
      const result = await this.spellcheck(sentence, this.config.spellchecking);
      sentence = result.correctSentence;
    }
    if (this.config.qna) {
      logger.debug('compute: qna');
      if (this.config.qna === 'before') {
        const result = await this.computeWithQna(sentence);
        logger.debug('compute: computing with QnA first', result);
        if (result.entities[0].value.length !== 0) {
          return result;
        }
        return this.computeWithClassifier(sentence);
      }
      const result = await this.computeWithClassifier(sentence);
      logger.debug('compute: computing with classifier first', result);
      if (result.intents.length !== 0) {
        return result;
      }
      return this.computeWithQna(sentence);
    }
    return this.computeWithClassifier(sentence);
  }

  /**
   * Computes intents and entities with classifier.
   * @param {String} sentence - the user sentence
   * @returns {Promise.<Object>}
   */
  async computeWithClassifier(sentence) {
    logger.debug('computeWithClassifier', sentence);
    const entities = await this.extractor.compute(sentence);
    logger.debug('computeWithClassifier: entities', entities);
    const intents = await this.classifier.compute(sentence, entities);
    logger.debug('computeWithClassifier: intents', intents);
    return { intents, entities };
  }

  /**
   * Computes intents and entities with QnA.
   * @param {String} sentence - the user sentence
   * @returns {Promise.<Object>}
   */
  async computeWithQna(sentence) {
    logger.debug('computeWithQna', sentence);
    try {
      const qnas = await this.qna.getMatchingQnas({ sentence });
      logger.debug('computeWithQna: qnas', qnas);
      const intents = [
        {
          name: 'qnas-dialog',
          value: 1.0,
        },
      ];
      const entities = [
        {
          dim: 'qnas',
          value: qnas,
        },
      ];
      return { intents, entities };
    } catch (error) {
      logger.error('Could not classify with QnA!');
      if (error.statusCode === 403) {
        throw new AuthenticationError();
      }
      throw error;
    }
  }

  /**
   * Spellchecks a sentence.
   * @param {String} sentence - a sentence
   * @param {String} key - a dictionary key
   * @returns {Object} the spellchecking result
   */
  async spellcheck(sentence, key) {
    try {
      logger.debug('spellcheck', sentence, key);
      const result = await this.spellchecking.compute({ sentence, key });
      logger.debug('spellcheck: result', result);
      return result;
    } catch (error) {
      logger.error('Could not spellcheck!');
      if (error.statusCode === 403) {
        throw new AuthenticationError();
      }
      throw error;
    }
  }
}

module.exports = Nlu;
