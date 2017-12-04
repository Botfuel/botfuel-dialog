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

const logger = require('logtown')('CommonView');
const View = require('./view');

/**
 * View that renders structured messages.
 * @extends View
 */
class CommonView extends View {
  /** @inheritDoc */
  render(key, data) {
    logger.debug('render', key, data);
    return this.getMessages(data);
  }

  /**
   * Gets the messages used for building the structured messages.
   * @param {Object} data - data used at display time
   * @returns {Object[]} an array of messages
   */
  getMessages(data) {
    logger.debug('getMessages', data);
    return [];
  }
}

module.exports = CommonView;
