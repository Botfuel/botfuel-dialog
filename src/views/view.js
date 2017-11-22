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

const logger = require('logtown')('View');
const { MissingImplementationError } = require('../errors');

/**
 * Generic view, to be subclassed.
 */
class View {
  /**
   * Renders a view as an array of json objects.
   * @param {String} botId - the bot id
   * @param {String} userId - the user id
   * @param {String} key - the view key
   * @param {Object} [data] - data used at display time
   * @returns {Object[]} the messages as an array json objects
   */
  renderAsJson(botId, userId, key, data) {
    logger.debug('renderAsJson', botId, userId, key, data);
    return this.render(key, data).map(msg => msg.toJson(botId, userId));
  }

  /**
   * Renders a view as an array of bot messages.
   * @param {String} key - the view key
   * @param {Object} [data] - data used at display time
   * @returns {Object[]} an array of bot messages
   */
  render() {
    throw new MissingImplementationError();
  }
}

module.exports = View;
