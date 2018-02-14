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

/* eslint-disable quotes */

const Adapter = require('../../src/adapters/adapter');
const BotTextMessage = require('../../src/messages/bot-text-message');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('Adapter', () => {
  test('should add properties to the json message', async () => {
    const message = new BotTextMessage('message');
    const extended = new Adapter({}).extendMessage(message.toJson('USER'));
    expect(Object.keys(extended)).toEqual(['id', 'timestamp', 'type', 'sender', 'user', 'payload']);
    expect(extended).toHaveProperty('user', 'USER');
    expect(extended).toHaveProperty('payload.value', 'message');
    expect(extended).not.toHaveProperty('adapter');
  });

  test('should generate an uuid', async () => {
    const uuid = new Adapter({}).getMessageUUID();
    expect(uuid).toMatch(UUID_REGEX);
  });

  test('should generate a timestamp', async () => {
    const timestamp = new Adapter({}).getMessageTimestamp();
    expect(typeof timestamp).toBe('number');
  });
});
