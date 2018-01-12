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

const UserTextMessage = require('../../src/messages/user-text-message');

describe('UserTextMessage', () => {
  test('should generate the proper json', async () => {
    const message = new UserTextMessage('foo');
    expect(message.toJson('USER')).toEqual({
      type: 'text',
      sender: 'user',
      user: 'USER',
      payload: {
        value: 'foo',
      },
    });
  });
});
