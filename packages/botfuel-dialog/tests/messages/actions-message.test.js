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

const ActionsMessage = require('../../src/messages/actions-message');
const Link = require('../../src/messages/link');
const MessageError = require('../../src/errors/message-error');

describe('ActionsMessage', () => {
  test('should throw an exception when malformed', async () => {
    expect(() => new ActionsMessage([{}])).toThrow(MessageError);
  });

  test('should generate the proper json', async () => {
    const message = new ActionsMessage([new Link('Botfuel', 'https://www.botfuel.io/en')]);
    expect(message.toJson('USER')).toEqual({
      type: 'actions',
      sender: 'bot',
      user: 'USER',
      payload: {
        value: [
          {
            type: 'link',
            text: 'Botfuel',
            value: 'https://www.botfuel.io/en',
          },
        ],
      },
    });
  });

  test('should generate the proper json with action options', async () => {
    const message = new ActionsMessage([new Link('Botfuel', 'https://www.botfuel.io/en', { className: 'my-class' })]);
    expect(message.toJson('USER')).toEqual({
      type: 'actions',
      sender: 'bot',
      user: 'USER',
      payload: {
        value: [
          {
            type: 'link',
            text: 'Botfuel',
            value: 'https://www.botfuel.io/en',
            options: {
              className: 'my-class',
            },
          },
        ],
      },
    });
  });
});
