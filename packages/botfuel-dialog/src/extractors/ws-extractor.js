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

import rp from 'request-promise-native';

const { clone, extend } = require('lodash');
const logger = require('logtown')('WsExtractor');
const AuthenticationError = require('../errors/authentication-error');
const MissingCredentialsError = require('../errors/missing-credentials-error');
const Extractor = require('./extractor');
const urlJoin = require('url-join');


const PROXY_HOST = process.env.BOTFUEL_PROXY_HOST || 'https://api.botfuel.io';
const ENTITY_EXTRACTION_ROUTE = '/nlp/entity-extraction';
const ENTITY_EXTRACTION_VERSION = 'v0';

const ENTITY_EXTRACTION_API = process.env.BOTFUEL_ENTITY_EXTRACTION_API_URL ||
                           urlJoin(PROXY_HOST, ENTITY_EXTRACTION_ROUTE, ENTITY_EXTRACTION_VERSION);

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
  }

  cleanParameters = params =>
    Object.keys(params).reduce((returns, element) => {
      if (params[element] !== undefined) {
        return { ...returns, [element]: params[element] };
      }
      return returns;
    }, {});

  /** @inheritDoc */
  async compute(sentence) {
    logger.debug('compute', sentence);
    const query = clone(this.parameters);
    extend(query, { sentence });
    return this.retryComputeRequest({
      method: 'GET',
      uri: ENTITY_EXTRACTION_API,
      // Needed so that arrays are serialized to foo=bar&foo=baz
      // Instead of foo[0]=bar&foo[1]=baz
      // (dimensions for example)
      useQuerystring: true,
      qs: this.cleanParameters({
        sentence: query.sentence,
        dimensions: query.dimensions,
        antidimensions: query.antidimensions,
        timezone: query.timezone,
        case_sensitive: query.case_sensitive,
        keep_quotes: query.keep_quotes,
        keep_accents: query.keep_accents,
      }),
      headers: {
        'App-Id': process.env.BOTFUEL_APP_ID,
        'App-Key': process.env.BOTFUEL_APP_KEY,
      },
      rejectUnauthorized: false,
      json: true,
    });
  }

  /**
   * Performs request with retries if the service is not available
   * @param requestOptions - Entity extraction request options
   * @param retries - Number of retries
   * @returns {Promise<*>}
   */
  async retryComputeRequest(requestOptions, retries = 3) {
    logger.debug('retryComputeRequest', requestOptions, retries);
    try {
      const entities = await rp(requestOptions);
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
      // If service is not available then retry the request
      if (error.statusCode === 503 && retries > 0) {
        return this.retryComputeRequest(requestOptions, retries - 1);
      }
      throw error;
    }
  }
}

module.exports = WsExtractor;
