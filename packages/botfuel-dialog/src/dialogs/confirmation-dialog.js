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

const logger = require('logtown')('ConfirmationDialog');
const PromptDialog = require('./prompt-dialog');

/**
 * The confirmation dialog is used to confirm a blocked dialog.
 * It prompts the user for a boolean confirmation.
 * It is meant to be subclassed in order to allow the customization of the corresponding view.
 *
 * @extends PromptDialog
 */
class ConfirmationDialog extends PromptDialog {
  /** @inheritDoc */
  async dialogWillComplete(userMessage, { matchedEntities }) {
    logger.debug('dialogWillComplete', userMessage, { matchedEntities });
    if (matchedEntities.answer) {
      // Clean entities for this dialog so it can be reused later
      await this.brain.conversationSet(userMessage.user, this.parameters.namespace, {});
      if (matchedEntities.answer.values[0].value === true) {
        return this.complete();
      }
      return this.cancelPrevious();
    }
    return this.wait();
  }
}

ConfirmationDialog.params = {
  namespace: 'confirmation',
  entities: {
    answer: {
      dim: 'system:boolean',
    },
  },
};

module.exports = ConfirmationDialog;
