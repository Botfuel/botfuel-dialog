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

// require('../../src/logger-manager').configure({ logger: 'botfuel'});

const PromptView = require('../../src/views/prompt-view');
const BotTextMessage = require('../../src/messages/bot-text-message');

describe('PromptView', () => {
  describe('renderEntities', () => {
    const view = new PromptView({});

    describe('when matched entities only', () => {
      test('should display the matched entities', () => {
        expect(
          view.render(
            {
              user: null,
            },
            {
              matchedEntities: { name1: {}, name2: {} },
              missingEntities: new Map(),
            },
          ),
        ).toEqual([new BotTextMessage('Entities defined: name1, name2')]);
      });
    });

    describe('when missing entities only', () => {
      test('should display the missing entities', () => {
        expect(
          view.render(
            {
              user: null,
            },
            {
              matchedEntities: {},
              missingEntities: new Map([['name1', {}], ['name2', {}]]),
            },
          ),
        ).toEqual([
          new BotTextMessage('Entities needed: name1, name2'),
          new BotTextMessage('Which name1?'),
        ]);
      });
    });
  });
});
