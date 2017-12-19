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
const logger = require('logtown')('AdapterManager');
const AdapterError = require('./errors/adapter-error');

/**
 * The adapter manager resolves the adapter at startup.
 */
class AdapterManager {
  /**
   * @constructor
   * @param {Object} bot - the bot using the adapter manager
   */
  constructor(bot) {
    const config = bot.config;
    logger.debug('constructor', config.path);

    this.bot = bot;
    this.adaptersPath = `${config.path}/src/adapters`;
    this.localAdaptersPath = `${__dirname}/adapters`;
  }

  /**
   * Gets the path for a given name.
   * @param {String} name - the adapter name
   * @returns {String|null} the path if exists or null
   */
  getPath(name) {
    logger.debug('getPath');
    const paths = [
      `${this.adaptersPath}/${name}-adapter.js`,
      `${this.localAdaptersPath}/${name}-adapter.js`,
    ];
    for (const path of paths) {
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
      const Adapter = require(path);
      return new Adapter(this.bot);
    }
    logger.error(`Could not resolve '${name}' adapter`);
    throw new AdapterError({
      message: `there is no adapter '${name}' at ${process.cwd()}/src/adapters/${name}-adapter.js`,
      adapter: name,
    });
  }
}

module.exports = AdapterManager;
