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
/* eslint-disable prefer-arrow-callback */

const { PromptDialog } = require('botfuel-dialog');

class AlcoholDialog extends PromptDialog {
  async dialogWillComplete(userMessage, data) {
    if (data.missingEntities.size === 0) {
      await this.brain.userSet(userMessage.user, 'isAlcoholDialogCompleted', true);
      return this.complete();
    }
    return this.wait();
  }
}

AlcoholDialog.params = {
  namespace: 'alcohol',
  entities: {
    age: {
      dim: 'number',
    },
    wantAlcohol: {
      dim: 'system:boolean',
      isFulfilled: (entity, { dialogEntities }) =>
        entity && dialogEntities.age && dialogEntities.age.values[0].value >= 18,
    },
  },
};

module.exports = AlcoholDialog;
