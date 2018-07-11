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

/* eslint-disable quotes, no-underscore-dangle */

const Bot = require('../../src/bot');
const TestAdapter = require('../../src/adapters/test-adapter');
const BotTextMessage = require('../../src/messages/bot-text-message');
const UserTextMessage = require('../../src/messages/user-text-message');

describe('TestAdapter', () => {
  test('should add properties to the json message', async () => {
    const message = new BotTextMessage('message');
    const adapter = new TestAdapter({});
    const extended = adapter.extendMessage(message.toJson(adapter.userId));
    expect(Object.keys(extended)).toEqual(['type', 'sender', 'user', 'payload']);
    expect(extended).not.toHaveProperty('id');
    expect(extended).not.toHaveProperty('adapter');
    expect(extended).not.toHaveProperty('timestamp');
  });

  test('should play user messages', async () => {
    const messages = [new UserTextMessage('message1'), new UserTextMessage('message2')];
    const bot = new Bot({ adapter: { name: 'test' } });
    await bot.init();
    await bot.adapter.play(messages);
    const conversation = await bot.brain.fetchLastConversation(bot.adapter.userId);
    expect(conversation._dialogs.previous.length).toBe(2);
  });
});
