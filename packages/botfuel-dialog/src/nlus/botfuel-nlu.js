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
const fsExtra = require('fs-extra');
const rp = require('request-promise-native');
const dir = require('node-dir');
const logger = require('logtown')('BotfuelNlu');
const BooleanExtractor = require('../extractors/boolean-extractor');
const LocationExtractor = require('../extractors/location-extractor');
const CompositeExtractor = require('../extractors/composite-extractor');
const AuthenticationError = require('../errors/authentication-error');
const SdkError = require('../errors/sdk-error');
const ClassificationResult = require('./classification-result');
const Nlu = require('./nlu');
const urlJoin = require('url-join');

const PROXY_HOST = process.env.BOTFUEL_PROXY_HOST || 'https://api.botfuel.io';
const SPELLCHECKING_ROUTE = '/nlp/spellchecking';
const SPELLCHECKING_VERSION = 'v1';

const SPELLCHECKING_API =
  process.env.BOTFUEL_SPELLCHECKING_API_URL ||
  urlJoin(PROXY_HOST, SPELLCHECKING_ROUTE, SPELLCHECKING_VERSION);

/**
 * NLU using Botfuel Trainer API
 */
class BotfuelNlu extends Nlu {
  /** @inheritdoc */
  constructor(config) {
    logger.debug('constructor', config);
    super(config);
    this.extractor = null;
    if (!process.env.BOTFUEL_APP_TOKEN) {
      throw new SdkError('BOTFUEL_APP_TOKEN is required for using the nlu service');
    }
    if (!process.env.BOTFUEL_APP_ID) {
      throw new SdkError('BOTFUEL_APP_ID is required for using the nlu service');
    }
    if (!process.env.BOTFUEL_APP_KEY) {
      throw new SdkError('BOTFUEL_APP_KEY is required for using the nlu service');
    }
    if (this.config) {
      const classificationFilterPath = `${this.config.path}/src/classification-filter.js`;
      if (fsExtra.pathExistsSync(classificationFilterPath)) {
        this.classificationFilter = require(classificationFilterPath);
      }
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
    extractors.push(new LocationExtractor({}));
    return extractors;
  }

  /** @inheritdoc */
  async init() {
    logger.debug('init');
    super.init();
    // Extractors
    this.extractor = new CompositeExtractor({
      extractors: this.getExtractors(`${this.config.path}/src/extractors`),
    });
  }

  /** @inheritdoc */
  async compute(sentence, context) {
    logger.debug('compute', sentence); // Context is not loggable
    // spellchecking
    // this is done outside the try/catch block to prevent catch-dialog to be triggered
    // if the error is not related to authentication
    sentence = await this.spellcheck(sentence);
    try {
      // computing entities
      const messageEntities = await this.extractor.compute(sentence);
      // computing intents
      let trainerUrl =
        process.env.BOTFUEL_TRAINER_API_URL || 'https://api.botfuel.io/trainer/api/v0';
      if (trainerUrl.slice(-1) !== '/') {
        trainerUrl += '/';
      }
      const options = {
        uri: `${trainerUrl}classify`,
        qs: {
          sentence,
          userId: context.userMessage.user,
        },
        headers: {
          'Botfuel-Bot-Id': process.env.BOTFUEL_APP_TOKEN,
          'App-Id': process.env.BOTFUEL_APP_ID,
          'App-Key': process.env.BOTFUEL_APP_KEY,
        },
        json: true,
      };
      const res = await rp(options);
      let classificationResults = res.map(data => new ClassificationResult(data));
      if (this.classificationFilter) {
        classificationResults = await this.classificationFilter(classificationResults, context);
        classificationResults = classificationResults.slice(0, this.config.multiIntent ? 2 : 1);
      }
      return { messageEntities, classificationResults };
    } catch (error) {
      logger.error('compute: error', error.statusCode);
      if (error.statusCode === 403) {
        throw new AuthenticationError();
      }
      throw error;
    }
  }

  /**
   * Spellchecks a sentence.
   * @param sentence - a sentence
   * @returns the spellchecked sentence
   */
  async spellcheck(sentence) {
    if (!this.config.nlu.spellchecking) {
      return sentence;
    }

    if (typeof this.config.nlu.spellchecking === 'string') {
      logger.warn(
        'Using dictionary key as spellchecking configuration is deprecated. Set nlu.spellchecking to true to enable spellchecking or false to disable it.',
      );
    }

    try {
      logger.debug('spellcheck', sentence);
      const options = {
        method: 'GET',
        uri: SPELLCHECKING_API,
        qs: {
          sentence,
        },
        rejectUnauthorized: false,
        json: true,
        headers: {
          'App-Id': process.env.BOTFUEL_APP_ID,
          'App-Key': process.env.BOTFUEL_APP_KEY,
          'Botfuel-Bot-Id': process.env.BOTFUEL_APP_TOKEN,
        },
      };
      const result = await rp({ ...options });
      logger.debug('spellcheck: result', result);
      return result.correctSentence;
    } catch (error) {
      logger.error('spellchecking: error', error);
      if (error.statusCode === 403) {
        throw new AuthenticationError();
      }
      // in case of spellchecking error returns the original sentence
      return sentence;
    }
  }
}

module.exports = BotfuelNlu;
