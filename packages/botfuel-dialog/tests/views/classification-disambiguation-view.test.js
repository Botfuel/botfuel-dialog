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

const ClassificationDisambiguationView = require('../../src/views/classification-disambiguation-view');
const ActionsMessage = require('../../src/messages/actions-message');
const BotTextMessage = require('../../src/messages/bot-text-message');
const Postback = require('../../src/messages/postback');
const ClassificationResult = require('../../src/nlus/classification-result');

describe('ClassificationDisambiguationView', () => {
  describe('render', () => {
    const classificationResults = [
      new ClassificationResult({
        type: ClassificationResult.TYPE_INTENT,
        name: 'trip',
        resolvePrompt: 'You want trip information?',
      }),
      new ClassificationResult({
        type: ClassificationResult.TYPE_QNA,
        name: 'qnas',
        resolvePrompt: 'You want delivery information?',
        answers: [[{ value: 'Here is your delivery information' }]],
      }),
    ];
    const view = new ClassificationDisambiguationView();

    test('should return correct choices for both intents and qnas', () => {
      expect(
        view.render({ user: 'TEST_USER' }, { classificationResults, messageEntities: [] }),
      ).toEqual([
        new BotTextMessage('What do you mean?'),
        new ActionsMessage([
          new Postback('You want trip information?', 'trip', []),
          new Postback('You want delivery information?', 'qnas', [
            [{ value: 'Here is your delivery information' }],
          ]),
        ]),
      ]);
    });
  });
});
