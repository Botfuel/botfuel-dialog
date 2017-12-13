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

const logger = require('logtown')('TextView');
const { BotTextMessage } = require('../messages');
const View = require('./view');

/**
 * View that renders text messages only.
 * @extends View
 */
class TextView extends View {
  // eslint-disable-next-line require-jsdoc
  render(data) {
    logger.debug('render', data);
    return this.getTexts(data).map(text => new BotTextMessage(text));
  }

  /**
   * Gets the texts used for building the BotTextMessages.
   * @param {Object} data - data used at display time
   * @returns {String[]} an array of strings
   */
  getTexts(data) {
    logger.debug('getTexts', data);
    return [];
  }
}

module.exports = TextView;
