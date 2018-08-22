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

const { clone, extend } = require('lodash');
const EntityExtraction = require('../nlp/resources/entity-extraction');
const logger = require('logtown')('WsExtractor');
const AuthenticationError = require('../errors/authentication-error');
const MissingCredentialsError = require('../errors/missing-credentials-error');
const Extractor = require('./extractor');

/**
 * Entity extraction web service based extractor.
 */
class WsExtractor extends Extractor {
  /**
   * @constructor
   * @param {Object} parameters - the extractor parameters
   */
  constructor(parameters) {
    super(parameters);
    if (!process.env.BOTFUEL_APP_ID || !process.env.BOTFUEL_APP_KEY) {
      throw new MissingCredentialsError(
        'BOTFUEL_APP_ID and BOTFUEL_APP_KEY are required for using the entity extraction service.',
      );
    }
    this.client = new EntityExtraction();
  }

  /** @inheritDoc */
  async compute(sentence) {
    try {
      logger.debug('compute', sentence);
      const query = clone(this.parameters);
      extend(query, { sentence });
      const entities = await this.client.compute(query);
      return entities.map(entity => ({
        ...entity,
        start: entity.start,
        end: entity.end,
      }));
    } catch (error) {
      logger.error('Could not extract the entities!');
      if (error.statusCode === 403) {
        throw new AuthenticationError();
      }
      throw error;
    }
  }
}

module.exports = WsExtractor;
