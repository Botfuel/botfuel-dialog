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

const { PromptView, BotTextMessage } = require('botfuel-dialog');

class QuestionView extends PromptView {
  renderEntities(matchedEntities, missingEntities) {
    const hasFirstAnswer = !!matchedEntities.firstAnswer && !missingEntities.firstAnswer;
    const isFirstAnswerPositive = hasFirstAnswer && matchedEntities.firstAnswer.values[0].value;
    const hasSecondAnswer = !!matchedEntities.secondAnswer && !missingEntities.secondAnswer;
    const isSecondAnswerPositive = hasSecondAnswer && matchedEntities.secondAnswer.values[0].value;

    if (!hasFirstAnswer) {
      return [new BotTextMessage('Would you like a second question?')];
    }

    if (!isFirstAnswerPositive) {
      return [new BotTextMessage('Okay, I’ll stop bothering you.')];
    }

    if (!hasSecondAnswer) {
      return [new BotTextMessage('Can you answer by yes or no?')];
    }

    if (isSecondAnswerPositive) {
      return [new BotTextMessage('You said yes!')];
    }

    return [new BotTextMessage('You said no.')];
  }
}

module.exports = QuestionView;
