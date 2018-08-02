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

// @flow

import type { Config } from './config';

const fs = require('fs');
const path = require('path');
const logger = require('logtown')('Resolver');
const ResolutionError = require('./errors/resolution-error');
const MissingImplementationError = require('./errors/missing-implementation-error');

/**
 * The adapter resolver resolves the adapter at startup.
 */
class Resolver<Component> {
  kind: string;
  directories: string[];

  /**
   * @constructor
   * @param config - the bot config
   * @param {String} kind - the kind of objects we want to resolve
   */
  constructor(config: Config, kind: string) {
    this.kind = kind;
    this.directories = config.componentRoots
      .map(componentRoot => path.join(componentRoot, `${kind}s`))
      .filter(fs.existsSync);
  }

  /**
   * Gets the possible filenames for a given name.
   * @param name - the component name
   * @returns the possible paths
   */
  getFilenames(name: string): string[] {
    return [`${name}-${this.kind}.js`];
  }

  /**
   * Gets the possible paths for a given name.
   * @param name - the component name
   * @returns the possible paths
   */
  getPaths(name: string): string[] {
    logger.debug('getPaths', name);

    const possibleFilenames = this.getFilenames(name);

    return this.directories
      .map(directory => possibleFilenames.map(filename => path.join(directory, filename)))
      .reduce((a, b) => [...a, ...b]);
  }

  /**
   * Gets the path for a given name.
   * @param name - the component name
   * @returns the path if exists or null
   */
  getPath(name: string): ?string {
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
   * Resolves the component for a given name.
   * @param name - the component name
   * @returns the component instance or null
   */
  resolve(name: string): Component {
    logger.debug('resolve', name);
    const componentPath = this.getPath(name);
    if (componentPath) {
      const Resolved: Class<Component> = require(componentPath);
      return this.resolutionSucceeded(Resolved);
    }
    throw new ResolutionError({
      kind: this.kind,
      name,
      paths: this.getPaths(name),
    });
  }

  /**
   * Instantiates a component after a successful resolution
   * @param Resolved - the component class
   * @returns the instance
   */
  resolutionSucceeded(
    componentClass: Class<Component>, // eslint-disable-line no-unused-vars
  ): Component {
    throw new MissingImplementationError();
  }
}

module.exports = Resolver;
