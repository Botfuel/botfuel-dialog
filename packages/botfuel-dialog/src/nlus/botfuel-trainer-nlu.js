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
const validUrl = require('valid-url');
const rp = require('request-promise-native');
const dir = require('node-dir');
const logger = require('logtown')('BotfuelTrainerNlu');
const BooleanExtractor = require('../extractors/boolean-extractor');
const LocationExtractor = require('../extractors/location-extractor');
const CompositeExtractor = require('../extractors/composite-extractor');
const Intent = require('./intent');
const Nlu = require('./nlu');

/**
 * Sample NLU module using NaturalJS.
 */
class BotfuelTrainerNlu extends Nlu {
  /** @inheritdoc */
  constructor(config) {
    logger.debug('constructor', config);
    super(config);
    this.extractor = null;
    this.qna = null;
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
  async compute(sentence /* context */) {
    logger.debug('compute', sentence);

    // compute entities
    const entities = await this.computeEntities(sentence);

    // compute intents

    if (!process.env.BOTFUEL_APP_TOKEN) {
      logger.error('BOTFUEL_APP_TOKEN are required for using the nlu service');
    }

    let trainerUri = this.config.trainerApiUri;
    if (!validUrl.isUri(trainerUri)) {
      logger.error('trainerApiUri in the configuration is not a valid URI');
    }

    if (trainerUri.slice(-1) !== '/') {
      trainerUri += '/';
    }

    const options = {
      uri: `${trainerUri}classify`,
      qs: {
        sentence,
      },
      headers: {
        'Botfuel-Bot-Id': process.env.BOTFUEL_APP_TOKEN,
      },
      json: true,
    };

    const res = await rp(options);

    const intents = res.map(data => new Intent(data));

    return { entities, intents };
  }

  /**
   * Computes intents and entities using the classifier.
   * @param {String} sentence - the user sentence
   * @returns {Object} entities
   */
  async computeEntities(sentence) {
    logger.debug('computeEntities', sentence);
    const entities = await this.extractor.compute(sentence);
    return entities;
  }
}

module.exports = BotfuelTrainerNlu;
