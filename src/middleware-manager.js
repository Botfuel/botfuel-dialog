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
   * @param {Object} adapter - the adapter
   */
  constructor(adapter) {
    this.adapter = adapter;
    this.bot = adapter.bot;
    this.inMiddlewares = [];
    this.outMiddlewares = [];
    // TODO: read from middleware.js
  }

  /**
   * Executes the in middlewares.
   * @async
   * @param {Object} context - the context
   * @param {Object} done - this function is executed after the middlewares
   * @returns {Promise.<void>}
   */
  async in(context, done) {
    await this.inRun(context, done, 0);
  }

  /**
   * Executes the in middlewares starting from a given index.
   * @async
   * @private
   * @param {Object} context - the context
   * @param {Object} done - this function is executed after the middlewares
   * @param {int} index - the index
   * @returns {Promise.<void>}
   */
  async inRun(context, done, index) {
    if (this.inMiddlewares.length === index) {
      await done();
    } else {
      const middleware = this.inMiddlewares[index];
      const next = async d => this.inRun(context, d, index + 1);
      await middleware(context, next, done);
    }
  }

  /**
   * Executes the out middlewares.
   * @async
   * @param {Object} context - the context
   * @param {Object} done - this function is executed after the middlewares
   * @returns {Promise.<void>}
   */
  async out(context, done) {
    await this.outRun(context, done, 0);
  }

  /**
   * Executes the out middlewares starting from a given index.
   * @async
   * @private
   * @param {Object} context - the context
   * @param {Object} done - this function is executed after the middlewares
   * @param {int} index - the index
   * @returns {Promise.<void>}
   */
  async outRun(context, done, index) {
    if (this.outMiddlewares.length === index) {
      await done();
    } else {
      const middleware = this.outMiddlewares[index];
      const next = async d => this.outRun(context, d, index + 1);
      await middleware(context, next, done);
    }
  }
}

module.exports = MiddlewareManager;
