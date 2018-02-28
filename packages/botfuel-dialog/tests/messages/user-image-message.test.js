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

const UserImageMessage = require('../../src/messages/user-image-message');
const MessageError = require('../../src/errors/message-error');

describe('UserImageMessage', () => {
  test('should throw an exception when malformed', async () => {
    expect(() => new UserImageMessage(null)).toThrow(MessageError);
  });

  test('should throw an exception when parameter is not a URL', async () => {
    expect(() => new UserImageMessage('hello')).toThrow(MessageError);
  });

  test('should generate the proper json', async () => {
    const message = new UserImageMessage('https://botfuel.io/image.jpg');
    expect(message.toJson('USER')).toEqual({
      type: 'image',
      sender: 'user',
      user: 'USER',
      payload: {
        value: 'https://botfuel.io/image.jpg',
      },
    });
  });
});
