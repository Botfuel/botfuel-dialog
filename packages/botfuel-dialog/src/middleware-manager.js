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

import type Bot from './bot';
import type { Config } from './config';
import type Brain from './brains/brain';
import type { UserMessage } from './types';
import type { BotMessageJson } from './messages/message';

const fs = require('fs-extra');
const logger = require('logtown')('MiddlewareManager');


export type InMiddlewareContext = {|
  user: string,
  brain: Brain,
  userMessage: UserMessage,
  config: Config,
|};

export type OutMiddlewareContext = {|
  user: string,
  brain: Brain,
  botMessages: BotMessageJson[],
  config: Config,
  userMessage: UserMessage,
|};


export type DoneFunction = () => Promise<void>;
export type NextFunction = (done?: DoneFunction) => Promise<void>;
export type CallbackFunction = () => Promise<void>;

export type InMiddleware = (
  context: InMiddlewareContext,
  next: NextFunction,
  done: DoneFunction,
) => Promise<void>;

export type OutMiddleware = (
  context: OutMiddlewareContext,
  next: NextFunction,
  done: DoneFunction,
) => Promise<void>;


export type MiddlewareDefinitions = {|
  in: InMiddleware[],
  out: OutMiddleware[],
|}


/**
 * Manages the middlewares.
 */
class MiddlewareManager {
  inMiddlewares: InMiddleware[];
  outMiddlewares: OutMiddleware[];

  constructor(
    bot: Bot,
    inMiddlewares: InMiddleware[] = [],
    outMiddlewares: OutMiddleware[] = [],
  ) {
    logger.debug('constructor', inMiddlewares, outMiddlewares);
    this.inMiddlewares = inMiddlewares;
    this.outMiddlewares = outMiddlewares;

    if (bot.config) {
      const middlewarePath = `${bot.config.path}/src/middlewares.js`;
      if (fs.pathExistsSync(middlewarePath)) {
        const middleware: MiddlewareDefinitions = require(middlewarePath);
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
  async in(context: InMiddlewareContext, callback: CallbackFunction): Promise<void> {
    await this.inRun(context, callback, 0, async () => {});
  }

  /**
   * Executes the in middlewares starting from a given index.
   * @private
   * @param callback - this function is executed only when middlewares complete
   * @param done - this function is executed at the end,
   * independently of the completion of the middlewares
   */
  async inRun(
    context: InMiddlewareContext,
    callback: CallbackFunction,
    index: number,
    done: DoneFunction,
  ): Promise<void> {
    if (this.inMiddlewares.length === index) {
      logger.debug('inRun: calling callback');
      await callback();
      logger.debug('inRun: calling done');
      await done();
    } else {
      const middleware = this.inMiddlewares[index];
      const next: NextFunction = async d => this.inRun(context, callback, index + 1, d || done);
      logger.debug('inRun: calling middleware');
      await middleware(context, next, done);
    }
  }

  /**
   * Executes the out middlewares.
   * @param callback - this function is executed when middlewares complete
   */
  async out(context: OutMiddlewareContext, callback: CallbackFunction): Promise<void> {
    const done: DoneFunction = async () => {};
    await this.outRun(context, callback, 0, done);
  }

  /**
   * Executes the out middlewares starting from a given index.
   * @private
   * @param callback - this function is executed only when middlewares complete
   * @param done - this function is executed at the end,
   * independently of the completion of the middlewares
   */
  async outRun(
    context: OutMiddlewareContext,
    callback: CallbackFunction,
    index: number,
    done: DoneFunction,
  ): Promise<void> {
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
