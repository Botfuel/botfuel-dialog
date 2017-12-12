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

const logger = require('logtown')('TextDialog');
const Dialog = require('./dialog');

/**
 * The text dialog is used to display text messages.
 * @extends Dialog
 */
class TextDialog extends Dialog {
  /**
   * @constructor
   * @param {Object} config - the bot config
   * @param {class} brain - the bot brain
   */
  constructor(config, brain) {
    super(config, brain, { reentrant: false });
  }

  // eslint-disable-next-line require-jsdoc
  async execute(adapter, userId, messageEntities) {
    logger.debug('execute', userId, messageEntities);
    const data = await this.getViewData(userId, messageEntities);
    await this.display(adapter, userId, data);
    return this.complete();
  }

  /**
   * Returns optional data used to generate the view.
   * @async
   * @param {String} userId - the user id
   * @param {Object[]} messageEntities - the message entities
   * @returns {Promise.<Object>} the data
   */
  async getViewData(userId, messageEntities) {
    logger.debug('getViewData', userId, messageEntities);
    return null;
  }
}

module.exports = TextDialog;
