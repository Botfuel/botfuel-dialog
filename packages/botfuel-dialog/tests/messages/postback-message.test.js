/**
 * Copyright (c) 2017 - present, Userfuel (https://www.botfuel.io).
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

const PostbackMessage = require('../../src/messages/postback-message');
const MessageError = require('../../src/errors/message-error');

describe('PostbackMessage', () => {
  test('should throw an exception dialog name is not a string', async () => {
    expect(() => new PostbackMessage({ name: 123, data: { messageEntities: [] } }))
      .toThrow(MessageError);
  });

  test('should throw an exception when entities are not an array', async () => {
    expect(() => new PostbackMessage({ name: 'greetings', data: { messageEntities: 'hello' } })).toThrow(MessageError);
  });

  test('should generate the proper json', async () => {
    const message = new PostbackMessage({ name: 'greetings', data: { messageEntities: [] } });
    expect(message.toJson('USER')).toEqual({
      type: 'postback',
      sender: 'user',
      user: 'USER',
      payload: {
        value: {
          name: 'greetings',
          data: {
            messageEntities: [],
          },
        },
      },
    });
  });
});
