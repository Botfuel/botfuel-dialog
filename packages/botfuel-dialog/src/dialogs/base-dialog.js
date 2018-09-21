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

const logger = require('logtown')('BaseDialog');
const Dialog = require('./dialog');

/**
 * The base dialog is a general-purpose dialog used to display basic messages.
 * @extends Dialog
 */
class BaseDialog extends Dialog {
  /** @inheritDoc */
  async execute(userMessage, data) {
    logger.debug('execute', { userMessage, data });
    const extraData = await this.dialogWillDisplay(userMessage, data);
    data = this.mergeData(extraData, data);
    const botMessages = await this.display(userMessage, data);
    const action = await this.dialogWillComplete(userMessage, data);
    return {
      action,
      botMessages,
    };
  }
}

module.exports = BaseDialog;
