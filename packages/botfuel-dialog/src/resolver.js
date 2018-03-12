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
const path = require('path');
const logger = require('logtown')('Resolver');
const ResolutionError = require('./errors/resolution-error');
const MissingImplementationError = require('./errors/missing-implementation-error');

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
    this.kind = kind;
    this.directories = config.componentRoots
      .map(componentRoot => path.join(componentRoot, `${kind}s`))
      .filter(fs.existsSync);
  }

  /**
   * Gets the possible paths for a given name.
   * @param {String} name - the adapter name
   * @returns {[String]} the possible paths
   */
  getFilenames(name) {
    return [`${name}-${this.kind}.js`];
  }

  /**
   * Gets the possible paths for a given name.
   * @param {String} name - the adapter name
   * @returns {[String]} the possible paths
   */
  getPaths(name) {
    logger.debug('getPaths', name);

    const possibleFilenames = this.getFilenames(name);

    return this.directories
      .map(directory => possibleFilenames.map(filename => path.join(directory, filename)))
      .reduce((a, b) => [...a, ...b]);
  }

  /**
   * Gets the path for a given name.
   * @param {String} name - the adapter name
   * @returns {String|null} the path if exists or null
   */
  getPath(name) {
    logger.debug('getPath');
    for (const componentPath of this.getPaths(name)) {
      logger.debug('getPath: test path', componentPath);
      if (fs.existsSync(componentPath)) {
        logger.debug('getPath: existing path', componentPath);
        return componentPath;
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
    const componentPath = this.getPath(name);
    if (componentPath) {
      const Resolved = require(componentPath);
      return this.resolutionSucceeded(Resolved);
    }
    throw new ResolutionError({
      kind: this.kind,
      name,
      paths: this.getPaths(name),
    });
  }

  /**
   * Instantiate a component after a successful resolution
   * @param {String} Resolved - the component class
   * @returns {Adapter|null} the instance or null
   */
  resolutionSucceeded() {
    throw new MissingImplementationError();
  }
}

module.exports = Resolver;
