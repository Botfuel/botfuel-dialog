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

const ConfirmationView = require('../../src/views/confirmation-view');
const BotTextMessage = require('../../src/messages/bot-text-message');

describe('ConfirmationView', () => {
  describe('render', () => {
    const view = new ConfirmationView({});

    describe('when no answer', () => {
      test('should ask the question again', () => {
        expect(view.render({}, { matchedEntities: {} })).toEqual([
          new BotTextMessage(view.dialogQuestion),
        ]);
      });
    });

    describe('when confirmed', () => {
      test('should confirm', () => {
        const data = { matchedEntities: { answer: { values: [{ value: true }] } } };
        expect(view.render({}, data)).toEqual([new BotTextMessage(view.dialogConfirmed)]);
      });
    });

    describe('when discarded', () => {
      test('should discard', () => {
        const data = { matchedEntities: { answer: { values: [{ value: false }] } } };
        expect(view.render({}, data)).toEqual([new BotTextMessage(view.dialogDiscarded)]);
      });
    });
  });
});
