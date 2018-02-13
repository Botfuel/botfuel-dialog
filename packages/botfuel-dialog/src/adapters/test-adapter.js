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

const logger = require('logtown')('TestAdapter');
const Adapter = require('./adapter');

/**
 * Adapter used for running tests.
 * @extends Adapter
 */
class TestAdapter extends Adapter {
  /**
   * @constructor
   * @param {Object} bot - the bot
   */
  constructor(bot) {
    logger.debug('constructor');
    super(bot);
    this.log = [];
    this.userId = 'USER_TEST';
  }

  /** @inheritDoc */
  async play(userMessages) {
    for (const userMessage of userMessages) {
      const userMessageAsJson = userMessage.toJson(this.userId);
      this.log.push(userMessageAsJson);
      // eslint-disable-next-line no-await-in-loop
      await this.handleMessage(userMessageAsJson);
    }
  }

  /** @inheritDoc */
  async sendMessage(botMessage) {
    this.log.push(botMessage);
  }

  /** @inheritDoc */
  extendMessage(message) {
    return message;
  }
}

module.exports = TestAdapter;
