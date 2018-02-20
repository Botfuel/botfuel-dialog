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

class QuestionDialog extends PromptDialog {
  async dialogWillComplete(userMessage) {
    await this.brain.userSet(userMessage.user, 'isQuestionDialogCompleted', true);
  }
}

QuestionDialog.params = {
  namespace: 'question',
  entities: {
    firstAnswer: {
      dim: 'system:boolean',
      priority: 2,
    },
    secondAnswer: {
      dim: 'system:boolean',
      priority: 1,
      isFulfilled: (entity, entities) => {
        const dialogEntities = entities && entities.dialogEntities;
        const firstAnswer = dialogEntities && dialogEntities.firstAnswer;

        if (firstAnswer && !firstAnswer.values[0].value) {
          return true;
        }

        return entity;
      },
    },
  },
};

module.exports = QuestionDialog;
