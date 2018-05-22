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
/* eslint prefer-arrow-callback: 'off' */

const { Bot, BotTextMessage, UserTextMessage } = require('botfuel-dialog');
const config = require('../test-config');

describe('Resolutions', () => {
  test('should resolve adapter', async () => {
    const bot = new Bot(config);

    expect(bot.adapter.secretSauce).toBe(41);
  });

  test('should resolve brain', async () => {
    const bot = new Bot(config);

    expect(bot.brain.secretSauce).toBe(42);
  });

  test('should resolve nlu', async () => {
    const bot = new Bot(config);

    expect(bot.nlu.secretSauce).toBe(43);
  });

  test('should respond to simple dialog with custom brain and nlu', async () => {
    const bot = new Bot(config);
    const { adapter } = bot;
    const { userId } = adapter;
    await bot.play([new UserTextMessage('How are you?')]);
    expect(bot.adapter.log).toEqual(
      [new UserTextMessage('How are you?'), new BotTextMessage('Hello human!')].map(msg =>
        msg.toJson(userId)),
    );

    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user._userId).toBe(userId);
    expect(user._conversations.length).toBe(1);
    expect(dialogs.stack).toHaveLength(0);
    expect(dialogs.previous.length).toBe(1);
    expect(dialogs.previous[0].name).toBe('hello');
  });

  test('should respond to dialog specific to the adapter and to view specific to language', async () => {
    const bot = new Bot(config);
    const { adapter } = bot;
    const { userId } = adapter;
    await bot.play([new UserTextMessage('see you later')]);
    expect(bot.adapter.log).toEqual(
      [new UserTextMessage('see you later'), new BotTextMessage('Goodbye human!')].map(msg =>
        msg.toJson(userId)),
    );

    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user._userId).toBe(userId);
    expect(user._conversations.length).toBe(1);
    expect(dialogs.stack).toHaveLength(0);
    expect(dialogs.previous.length).toBe(1);
    expect(dialogs.previous[0].name).toBe('goodbye');
  });
});
