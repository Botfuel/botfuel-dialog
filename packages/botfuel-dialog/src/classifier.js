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

const Fs = require('fs');
const util = require('util');
const fsExtra = require('fs-extra');
const Natural = require('natural');
const logger = require('logtown')('Classifier');
const { getConfiguration } = require('./config');

const fsStat = util.promisify(Fs.stat);

const INTENT_SUFFIX = '.intent';

/**
 * Classifier
 */
class Classifier {
  /**
   * @constructor
   * @param {Object} config - the bot config
   */
  constructor(config) {
    this.config = getConfiguration(config);
    logger.debug('constructor', config);
    this.modelFilename = `${this.config.path}/models/model.json`;
    this.intentDirname = `${this.config.path}/src/intents`;
    this.classifier = null;
    this.getStemmer().attach();
  }

  /**
   * Get classifier stemmer for it's locale
   * @returns {*|Stemmer} - the stemmer
   */
  getStemmer() {
    switch (this.config.locale) {
      case 'fr':
        return Natural.PorterStemmerFr;
      case 'es':
        return Natural.PorterStemmerEs;
      case 'en':
      default:
        return Natural.PorterStemmer;
    }
  }

  /**
   * Init the classifier
   * @async
   * @returns {Promise.<void|Error>}
   */
  async init() {
    logger.debug('init');
    const intentsAndModelExist = await this.intentsAndModelExist(
      this.modelFilename,
      this.intentDirname,
    );
    // If no model file or no intent file, just warn
    if (!intentsAndModelExist) {
      logger.warn('No intents directory or model file');
      return null;
    }
    const isModelUpToDate = await this.isModelUpToDate(this.modelFilename, this.intentDirname);
    if (!isModelUpToDate) {
      logger.warn('Your model is not up-to-date.');
      logger.warn('Train it by running: ./node_modules/.bin/botfuel-train <CONFIG_FILE>');
    }
    return new Promise((resolve, reject) => {
      Natural.LogisticRegressionClassifier.load(this.modelFilename, null, (err, classifier) => {
        if (err !== null) {
          return reject(err);
        }
        this.classifier = classifier;
        return resolve();
      });
    });
  }

  /**
   * Checks if the model is up-to-date: is the model fresher than the intents?
   * @param {String} modelFilePath - the model file path
   * @param {String} intentsDirPath - the intents dir path
   * @returns {Boolean} true if the model is uptodate, false if not
   */
  async isModelUpToDate(modelFilePath, intentsDirPath) {
    logger.debug('isModelUpToDate');
    const intentFiles = Fs.readdirSync(intentsDirPath, 'utf8');
    const filteredIntents = intentFiles.filter(
      file => file.substr(-INTENT_SUFFIX.length) === INTENT_SUFFIX,
    );
    const [{ mtimeMs: modelLastModifiedTime }, ...fileStats] = await Promise.all([
      fsStat(modelFilePath),
      ...filteredIntents.map(intentFile => fsStat(`${intentsDirPath}/${intentFile}`)),
    ]);
    return fileStats
      .map(file => file.mtimeMs)
      .every(timestamp => timestamp < modelLastModifiedTime);
  }

  /**
   * Checks the model file and intents directory exist
   * @param {String} modelFilePath - the model file path
   * @param {String} intentsDirPath - the intents dir path
   * @returns {Boolean} true if the model file and intents directory exist, false if not
   */
  async intentsAndModelExist(modelFilePath, intentsDirPath) {
    logger.debug('intentsAndModelExist');
    const [intentDirExists, modelFileExists] = await Promise.all([
      fsExtra.pathExists(intentsDirPath),
      fsExtra.pathExists(modelFilePath),
    ]);
    return intentDirExists && modelFileExists;
  }

  /**
   * Compute features for a sentence
   * @param {String} sentence - the sentence
   * @returns {String[]} the tokenized and stemmed sentence
   */
  computeFeatures(sentence) {
    return sentence.tokenizeAndStem();
  }

  /**
   * Classifies a sentence.
   * @param {String} sentence - the sentence
   * @param {Object[]} entities - the entities
   * @returns {Promise.<*>} a promise with entities and intents
   */
  async compute(sentence, entities) {
    logger.debug('compute', sentence, entities);
    // The bot has no intent
    if (!this.classifier) {
      return [];
    }
    const features = this.computeFeatures(sentence, entities);
    return this
      .classifier.getClassifications(features)
      .map(intent => ({
        name: intent.label,
        value: intent.value,
      }));
  }

  /**
   * Train bot model
   * @returns {Promise.<void>}
   */
  async train() {
    logger.debug('train');
    // Make sure model file exists
    await fsExtra.ensureFile(this.modelFilename);
    this.classifier = new Natural.LogisticRegressionClassifier(this.getStemmer());
    Fs.readdirSync(this.intentDirname, 'utf8')
      .filter(fileName => fileName.substr(-INTENT_SUFFIX.length) === INTENT_SUFFIX)
      .map((fileName) => {
        logger.debug('train: filename', fileName);
        const intent = fileName.substring(0, fileName.length - INTENT_SUFFIX.length);
        logger.debug('train: intent', intent);
        return Fs.readFileSync(`${this.intentDirname}/${fileName}`, 'utf8')
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
