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

const QnasView = require('../../src/views/qnas-view');
const BotTextMessage = require('../../src/messages/bot-text-message');
const ActionsMessage = require('../../src/messages/actions-message');
const Postback = require('../../src/messages/postback');

describe('QnasView', () => {
  describe('renderEntities', () => {
    const view = new QnasView({});

    describe('when no qnas', () => {
      test('should display no postback', () => {
        expect(
          view.render({
            qnas: [],
          }),
        ).toEqual([new BotTextMessage('What do you mean?'), new ActionsMessage([])]);
      });
    });

    describe('when 1 qna', () => {
      test('should display answer', () => {
        expect(
          view.render({
            qnas: [{ answer: 'answer' }],
          }),
        ).toEqual([new BotTextMessage('answer')]);
      });
    });

    describe('when 2 qnas', () => {
      test('should display 2 postbacks', () => {
        expect(
          view.render({
            qnas: [
              {
                answer: 'answer1',
                questions: ['question1a'],
              },
              {
                answer: 'answer2',
                questions: ['question2a'],
              },
            ],
          }),
        ).toEqual([
          new BotTextMessage('What do you mean?'),
          new ActionsMessage([
            new Postback('question1a', 'qnas', [{ dim: 'qnas', value: [{ answer: 'answer1' }] }]),
            new Postback('question2a', 'qnas', [{ dim: 'qnas', value: [{ answer: 'answer2' }] }]),
          ]),
        ]);
      });
    });
  });
});
