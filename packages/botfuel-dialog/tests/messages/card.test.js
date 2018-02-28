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

const Card = require('../../src/messages/card');
const MessageError = require('../../src/errors/message-error');

describe('Card', () => {
  test('should throw an exception when malformed string', async () => {
    expect(() => new Card(null, null, []).validate()).toThrow(MessageError);
  });

  test('should throw an exception when malformed actions', async () => {
    expect(() => new Card('title', 'http://domain.com', null).validate()).toThrow(MessageError);
    expect(() => new Card('title', 'http://domain.com', ['not an action']).validate()).toThrow(
      MessageError,
    );
  });
});
