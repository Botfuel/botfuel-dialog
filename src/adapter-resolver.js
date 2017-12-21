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

const logger = require('logtown')('AdapterResolver');
const Resolver = require('./resolver');
const AdapterError = require('./errors/adapter-error');

/**
 * The adapter resolver resolves the adapter at startup.
 */
class AdapterResolver extends Resolver {
  /**
   * @constructor
   * @param {Object} bot - the bot
   */
  constructor(bot) {
    super(bot.config, 'adapters');
    this.bot = bot;
  }

  /**
   * Returns the paths used for resolution.
   * @param {String} name - the name to resolved
   * @returns {String[]} an array of paths
   */
  getPaths(name) {
    logger.debug('getPaths', name);
    return [`${this.path}/${name}-adapter.js`, `${this.localPath}/${name}-adapter.js`];
  }

  /**
   * Throws an error to indicate that the resolution failed.
   * @param {String} name - the name to resolved
   * @throws {AdapterError}
   * @returns {void}
   */
  resolutionFailed(name) {
    logger.error(`Could not resolve '${name}' adapter`);
    throw new AdapterError({
      adapter: name,
      message: `There is no adapter '${name}' at ${process.cwd()}/src/adapters/${name}-adapter.js`,
    });
  }

  /**
   * Returns the resolved instance.
   * @param {Function} Resolved - the resolved class
   * @returns {Object} the resolved instance
   */
  resolutionSucceeded(Resolved) {
    return new Resolved(this.bot);
  }
}

module.exports = AdapterResolver;
