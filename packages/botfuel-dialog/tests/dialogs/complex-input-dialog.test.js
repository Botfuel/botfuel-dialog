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

const Bot = require('../../src/bot');
const UserTextMessage = require('../../src/messages/user-text-message');
const BotTextMessage = require('../../src/messages/bot-text-message');
const TEST_CONFIG = require('../../src/config').getConfiguration({
  adapter: {
    name: 'test',
  },
});

const TOO_LONG_INPUT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';

describe('ComplexInputDialog', () => {
  test('should run complex-input dialog when input is too long', async () => {
    const bot = new Bot(TEST_CONFIG);
    const { adapter } = bot;
    const { userId } = adapter;

    await bot.play([
      new UserTextMessage(TOO_LONG_INPUT),
    ]);
    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage(TOO_LONG_INPUT),
        new BotTextMessage('Your input is too complex.'),
      ].map(msg => msg.toJson(userId)),
    );

    const dialogs = await bot.brain.getDialogs(userId);
    expect(dialogs.stack).toHaveLength(0);
    expect(dialogs.previous.length).toBe(1);
    expect(dialogs.previous[0].name).toBe('complex-input');
  });
});
