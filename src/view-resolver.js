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

const logger = require('logtown')('ViewResolver');
const Resolver = require('./resolver');
const ViewError = require('./errors/view-error');

/**
 * The view resolver resolves the view for a given dialog.
 */
class ViewResolver extends Resolver {
  /**
   * @constructor
   * @param {Object} config - the bot config
   */
  constructor(config) {
    super(config, 'views');
  }

  /** @inheritdoc */
  getPaths(name) {
    logger.debug('getPaths', name);
    return [
      `${this.path}/${name}-view.${this.config.locale}.js`,
      `${this.path}/${name}-view.js`,
      `${this.localPath}/${name}-view.${this.config.locale}.js`,
      `${this.localPath}/${name}-view.js`,
    ];
  }

  /** @inheritdoc */
  resolutionFailed(name) {
    logger.error(`Could not resolve '${name}' view`);
    throw new ViewError({
      view: name,
      message: `There is no view '${name}' at ${process.cwd()}/src/views/${name}-view.js`,
    });
  }

  /** @inheritdoc */
  resolutionSucceeded(Resolved) {
    return new Resolved();
  }
}

module.exports = ViewResolver;
