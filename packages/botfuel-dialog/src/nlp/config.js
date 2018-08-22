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

const urlJoin = require('url-join');

const baseConfig = {
  PROXY_HOST: process.env.BOTFUEL_PROXY_HOST || 'https://api.botfuel.io',
  SPELLCHECKING_ROUTE: '/nlp/spellchecking',
  SPELLCHECKING_VERSION: 'v1',
  SENTIMENT_ANALYSIS_ROUTE: '/nlp/sentiment-analysis',
  SENTIMENT_ANALYSIS_VERSION: 'v0',
  ENTITY_EXTRACTION_ROUTE: '/nlp/entity-extraction',
  ENTITY_EXTRACTION_VERSION: 'v0',
};

module.exports = {
  SPELLCHECKING_API:
    process.env.BOTFUEL_SPELLCHECKING_API_URL ||
    urlJoin(baseConfig.PROXY_HOST, baseConfig.SPELLCHECKING_ROUTE,
      baseConfig.SPELLCHECKING_VERSION),

  SENTIMENT_ANALYSIS_API:
    process.env.BOTFUEL_SENTIMENT_ANALYSIS_API_URL ||
    urlJoin(baseConfig.PROXY_HOST, baseConfig.SENTIMENT_ANALYSIS_ROUTE,
      baseConfig.SENTIMENT_ANALYSIS_VERSION),

  ENTITY_EXTRACTION_API:
    process.env.BOTFUEL_ENTITY_EXTRACTION_API_URL ||
    urlJoin(baseConfig.PROXY_HOST, baseConfig.ENTITY_EXTRACTION_ROUTE,
      baseConfig.ENTITY_EXTRACTION_VERSION),
};
