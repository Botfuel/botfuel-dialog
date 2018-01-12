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

const fs = require('fs-extra');
const logger = require('logtown')('MiddlewareManager');

/**
 * Manages the middlewares.
 */
class MiddlewareManager {
  /**
   * @constructor
   * @param {Object} bot - the bot
   * @param {Function[]} [inMiddlewares] - an optional array of middlewares
   * @param {Function[]} [outMiddlewares] - an optional array of middlewares
   */
  constructor(bot, inMiddlewares, outMiddlewares) {
    this.inMiddlewares = inMiddlewares || [];
    this.outMiddlewares = outMiddlewares || [];
    if (bot.config) {
      const middlewaresPath = `${bot.config.path}/src/middlewares.js`;
      if (fs.pathExistsSync(middlewaresPath)) {
        const middlewares = require(middlewaresPath);
        inMiddlewares = middlewares.inMiddlewares || inMiddlewares;
        outMiddlewares = middlewares.outMiddlewares || outMiddlewares;
      }
    }
  }

  /**
   * Executes the in middlewares.
   * @async
   * @param {Object} context - the context
   * @param {Object} callback - this function is executed when middlewares complete
   * @returns {Promise.<void>}
   */
  async in(context, callback) {
    logger.debug('in', context, callback);
    await this.inRun(context, callback, 0);
  }

  /**
   * Executes the in middlewares starting from a given index.
   * @async
   * @private
   * @param {Object} context - the context
   * @param {Object} callback - this function is executed only when middlewares complete
   * @param {int} index - the index
   * @param {Object} done - this function is executed at the end,
   * independently of the completion of the middlewares
   * @returns {Promise.<void>}
   */
  async inRun(context, callback, index, done = async () => {}) {
    logger.debug('inRun', context, callback, index, done);
    if (this.inMiddlewares.length === index) {
      await callback();
      await done();
    } else {
      const middleware = this.inMiddlewares[index];
      const next = async d => this.inRun(context, callback, index + 1, d);
      await middleware(context, next, done);
    }
  }

  /**
   * Executes the out middlewares.
   * @async
   * @param {Object} context - the context
   * @param {Object} callback - this function is executed when middlewares complete
   * @returns {Promise.<void>}
   */
  async out(context, callback) {
    logger.debug('out', context, callback);
    await this.outRun(context, callback, 0);
  }

  /**
   * Executes the out middlewares starting from a given index.
   * @async
   * @private
   * @param {Object} context - the context
   * @param {Object} callback - this function is executed only when the middlewares complete
   * @param {int} index - the index
   * @param {Object} done - this function is executed at the end,
   * independently of the completion of the middlewares
   * @returns {Promise.<void>}
   */
  async outRun(context, callback, index, done = async () => {}) {
    logger.debug('outRun', context, callback, index, done);
    if (this.outMiddlewares.length === index) {
      await callback();
      await done();
    } else {
      const middleware = this.outMiddlewares[index];
      const next = async d => this.outRun(context, callback, index + 1, d);
      await middleware(context, next, done);
    }
  }
}

module.exports = MiddlewareManager;
