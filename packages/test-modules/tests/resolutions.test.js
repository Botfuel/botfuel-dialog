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

  // test('should use dialog and view from module', async () => {
  //   const bot = new Bot(config);
  //   const userId = bot.adapter.userId;
  //   await bot.play([new UserTextMessage('from module')]);
  //   expect(bot.adapter.log).toEqual(
  //     [
  //       new UserTextMessage('from module'),
  //       new BotTextMessage('Hello human!'),
  //       new BotTextMessage('Special data: 42'),
  //     ].map(msg => msg.toJson(userId)),
  //   );

  //   const user = await bot.brain.getUser(userId);
  //   const dialogs = await bot.brain.getDialogs(userId);
  //   expect(user._userId).toBe(userId);
  //   expect(user._conversations.length).toBe(1);
  //   expect(dialogs.stack).toHaveLength(0);
  //   expect(dialogs.previous.length).toBe(1);
  //   expect(dialogs.previous[0].name).toBe('sample-concrete-module');
  // });

  test('should use dialog and view extended from abstract classes defined in module', async () => {
    const bot = new Bot(config);
    const { adapter } = bot;
    const { userId } = adapter;
    await bot.play([new UserTextMessage('from bot')]);
    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('from bot'),
        new BotTextMessage('Extending a view defined in a module...'),
        new BotTextMessage('Special data: 42'),
      ].map(msg => msg.toJson(userId)),
    );

    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user._userId).toBe(userId);
    expect(user._conversations.length).toBe(1);
    expect(dialogs.stack).toHaveLength(0);
    expect(dialogs.previous.length).toBe(1);
    expect(dialogs.previous[0].name).toBe('concrete');
  });
});
