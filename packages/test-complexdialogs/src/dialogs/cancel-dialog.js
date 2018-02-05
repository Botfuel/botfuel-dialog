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

const { ConfirmationDialog } = require('botfuel-dialog');

class Cancel extends ConfirmationDialog {
  async dialogWillComplete(userMessage, { matchedEntities }) {
    const answer = matchedEntities.boolean.values[0].value;

    // Clean entities for this dialog so it can be reused later
    await this.brain.conversationSet(userMessage.user, this.parameters.namespace, {});

    if (answer) {
      return this.cancelPrevious('greetings');
    }

    return this.complete();
  }
}

Cancel.params = {
  namespace: 'cancel',
  entities: {
    boolean: {
      dim: 'system:boolean',
    },
  },
};

module.exports = Cancel;
