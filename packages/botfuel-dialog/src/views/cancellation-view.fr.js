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

const PromptView = require('./prompt-view');
const BotTextMessage = require('../messages/bot-text-message');

class CancelView extends PromptView {
  render(userMessage, { matchedEntities }) {
    const answer = matchedEntities.answer && matchedEntities.answer.values[0].value;

    if (answer === true) {
      return [new BotTextMessage('Dialogue annulé!')];
    }

    if (answer === false) {
      return [new BotTextMessage('Reprise du dialogue...')];
    }

    return [new BotTextMessage('Êtes-vous sûr de vouloir annuler le dialogue?')];
  }
}

module.exports = CancelView;
