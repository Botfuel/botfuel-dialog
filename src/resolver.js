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
const logger = require('logtown')('Resolver');

/**
 * The adapter resolver resolves the adapter at startup.
 */
class Resolver {
  /**
   * @constructor
   * @param {Object} config - the bot config
   * @param {String} kind - the kind of objects we want to resolve
   */
  constructor(config, kind) {
    this.config = config;
    this.path = `${config.path}/src/${kind}`;
    this.localPath = `${__dirname}/${kind}`;
  }

  /**
   * Gets the path for a given name.
   * @param {String} name - the adapter name
   * @returns {String|null} the path if exists or null
   */
  getPath(name) {
    logger.debug('getPath');
    for (const path of this.getPaths(name)) {
      logger.debug('getPath: test path', path);
      if (fs.existsSync(path)) {
        logger.debug('getPath: existing path', path);
        return path;
      }
    }
    return null;
  }

  /**
   * Resolves the adapter for a given name.
   * @param {String} name - the adapter name
   * @returns {Adapter|null} the adapter instance or null
   */
  resolve(name) {
    logger.debug('resolve', name);
    const path = this.getPath(name);
    if (path) {
      const Resolved = require(path);
      return this.resolutionSucceeded(Resolved);
    }
    return this.resolutionFailed(name);
  }
}

module.exports = Resolver;
