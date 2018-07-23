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
const PostbackMessage = require('../../src/messages/postback-message');
const Bot = require('../../src/bot');

describe('QnasView', () => {
  describe('render', () => {
    const view = new QnasView({});

    test('should display answer', () => {
      expect(
        view.render(
          {
            user: null,
          },
          {
            answers: [
              [
                {
                  payload: { value: 'answer' },
                },
              ],
            ],
          },
        ),
      ).toEqual([new BotTextMessage('answer')]);
    });

    test('should display 2 messages in answer', () => {
      expect(
        view.render(
          {
            user: null,
          },
          {
            answers: [
              [
                {
                  payload: { value: 'answer 1' },
                },
                {
                  payload: { value: 'answer 2' },
                },
              ],
            ],
          },
        ),
      ).toEqual([new BotTextMessage('answer 1'), new BotTextMessage('answer 2')]);
    });
  });

  describe('test QnA view in bot', () => {
    test('should respond to postback message', async () => {
      const bot = new Bot({ adapter: { name: 'test' } });
      const answers = [
        [
          {
            payload: { value: 'answer' },
          },
        ],
      ];
      await bot.play([new PostbackMessage({ name: 'qnas', data: { messageEntities: answers } })]);

      expect(bot.adapter.log).toEqual(
        [new PostbackMessage({ name: 'qnas', data: { messageEntities: answers } }), new BotTextMessage('answer')].map(msg =>
          msg.toJson('USER_TEST')),
      );
    });
  });
});
