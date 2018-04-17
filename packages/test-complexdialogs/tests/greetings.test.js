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
/* eslint-disable prefer-arrow-callback */

const { Bot, BotTextMessage, UserTextMessage } = require('botfuel-dialog');
const config = require('../test-config');

describe('GreetingsDialog', () => {
  test('should have the proper interaction when the bot not understand', async () => {
    const bot = new Bot(config);
    const { adapter } = bot;
    const { userId } = adapter;
    await bot.play([
      new UserTextMessage('Hello bot!'),
      new UserTextMessage("What's the weather today ?"),
    ]);
    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('Hello bot!'),
        new BotTextMessage('Hello human!'),
        new UserTextMessage("What's the weather today ?"),
        new BotTextMessage('Not understood.'),
      ].map(msg => msg.toJson(userId)),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user._conversations.length).toBe(1);
    expect(dialogs.stack).toHaveLength(0);
    expect(dialogs.previous.length).toBe(2);
    expect(dialogs.previous[0].name).toBe('greetings');
    expect(dialogs.previous[1].name).toBe('default');
  });

  test('should say something different when greeting for the second time', async () => {
    const bot = new Bot(config);
    const { adapter } = bot;
    const { userId } = adapter;
    await bot.play([new UserTextMessage('Hello bot!'), new UserTextMessage('Hello bot!')]);
    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('Hello bot!'),
        new BotTextMessage('Hello human!'),
        new UserTextMessage('Hello bot!'),
        new BotTextMessage('Hello again human!'),
      ].map(msg => msg.toJson(userId)),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user._conversations.length).toBe(1);
    expect(dialogs.stack).toHaveLength(0);
    expect(dialogs.previous.length).toBe(2);
    expect(dialogs.previous[0].name).toBe('greetings');
    expect(dialogs.previous[1].name).toBe('greetings');
  });
});
