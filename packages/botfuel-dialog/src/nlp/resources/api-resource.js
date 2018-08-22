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

class ApiResource {
  /**
   * Clean parameters object by filtering out undefineds.
   *
   * @param {Object} params the parameters object.
   * @returns {Object} the clean object of parameters
   * @static
   * @memberof ApiResource
   */
  static cleanParameters = params =>
    Object.keys(params).reduce((returns, element) => {
      if (params[element] !== undefined) {
        return { ...returns, [element]: params[element] };
      }
      return returns;
    }, {});

  constructor({ appId, appKey }) {
    const baseOptions = {
      headers: { 'App-Id': appId, 'App-Key': appKey },
      rejectUnauthorized: false,
      json: true,
    };

    this.rp = options =>
      rp({
        ...baseOptions,
        ...options,
        ...(options.qs && { qs: this.constructor.cleanParameters(options.qs) }),
        ...(options.body && { body: this.constructor.cleanParameters(options.body) }),
      });
  }
}

module.exports = ApiResource;
