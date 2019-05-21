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
  constructor(bot, inMiddlewares = [], outMiddlewares = []) {
    logger.debug('constructor', inMiddlewares, outMiddlewares);
    this.inMiddlewares = inMiddlewares;
    this.outMiddlewares = outMiddlewares;

    if (bot.config) {
      const middlewarePath = `${bot.config.path}/src/middlewares.js`;
      if (fs.pathExistsSync(middlewarePath)) {
        const middleware = require(middlewarePath);
        this.inMiddlewares = middleware.in || this.inMiddlewares;
        this.outMiddlewares = middleware.out || this.outMiddlewares;
      }
    }
    logger.debug('constructor', this.inMiddlewares, this.outMiddlewares);
  }

  /**
   * Executes the in middlewares.
   * @param {Object} callback - this function is executed when middlewares complete
   */
  async in(context, callback) {
    await this.inRun(context, callback, 0, async () => {});
  }

  /**
   * Executes the in middlewares starting from a given index.
   * @private
   * @param callback - this function is executed only when middlewares complete
   * @param done - this function is executed at the end,
   * independently of the completion of the middlewares
   */
  async inRun(context, callback, index, done) {
    if (this.inMiddlewares.length === index) {
      logger.debug('inRun: calling callback');
      await callback();
      logger.debug('inRun: calling done');
      await done();
    } else {
      const middleware = this.inMiddlewares[index];
      const next = async d => this.inRun(context, callback, index + 1, d || done);
      logger.debug('inRun: calling middleware');
      await middleware(context, next, done);
    }
  }

  /**
   * Executes the out middlewares.
   * @param callback - this function is executed when middlewares complete
   */
  async out(context, callback) {
    const done = async () => {};
    await this.outRun(context, callback, 0, done);
  }

  /**
   * Executes the out middlewares starting from a given index.
   * @private
   * @param callback - this function is executed only when middlewares complete
   * @param done - this function is executed at the end,
   * independently of the completion of the middlewares
   */
  async outRun(context, callback, index, done) {
    if (this.outMiddlewares.length === index) {
      logger.debug('outRun: calling callback');
      await callback();
      logger.debug('outRun: calling done');
      await done();
    } else {
      const middleware = this.outMiddlewares[index];
      const next = async d => this.outRun(context, callback, index + 1, d || done);
      logger.debug('outRun: calling middleware');
      await middleware(context, next, done);
    }
  }
}

module.exports = MiddlewareManager;
