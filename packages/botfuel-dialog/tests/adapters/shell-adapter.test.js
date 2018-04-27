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

const ShellAdapter = require('../../src/adapters/shell-adapter');
const BotTextMessage = require('../../src/messages/bot-text-message');

describe('ShellAdapter', () => {
  test('should add properties to the json message', async () => {
    const message = new BotTextMessage('message');
    const extended = new ShellAdapter({}).extendMessage(message.toJson('USER'));
    expect(Object.keys(extended).sort()).toEqual(['id', 'payload', 'sender', 'timestamp', 'type', 'user']);
    expect(extended).toHaveProperty('user', 'USER');
    expect(extended).toHaveProperty('payload.value', 'message');
  });
});
