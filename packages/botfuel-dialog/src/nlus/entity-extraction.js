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

/* eslint-disable camelcase */

import rp from 'request-promise-native';

import configRoute from './configRoute';

class EntityExtraction {

  cleanParameters = params =>
    Object.keys(params).reduce((returns, element) => {
      if (params[element] !== undefined) {
        return { ...returns, [element]: params[element] };
      }
      return returns;
    }, {});

  compute({
    sentence,
    dimensions,
    antidimensions,
    timezone,
    case_sensitive,
    keep_quotes,
    keep_accents,
  }) {
    const options = {
      method: 'GET',
      uri: configRoute.ENTITY_EXTRACTION_API,
      // Needed so that arrays are serialized to foo=bar&foo=baz
      // Instead of foo[0]=bar&foo[1]=baz
      // (dimensions for example)
      useQuerystring: true,
      qs: {
        sentence,
        dimensions,
        antidimensions,
        timezone,
        case_sensitive,
        keep_quotes,
        keep_accents,
      },
      headers: {
        'App-Id': process.env.BOTFUEL_APP_ID,
        'App-Key': process.env.BOTFUEL_APP_KEY,
      },
      rejectUnauthorized: false,
      json: true,
    };
    return rp({ ...options,
      ...(options.qs && { qs: this.cleanParameters(options.qs) }) });
  }
}

module.exports = EntityExtraction;
