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

describe('Alcohol', () => {
  test('should complete dialog', async () => {
    const bot = new Bot(config);
    const { adapter } = bot;
    const { userId } = adapter;

    await bot.play([
      new UserTextMessage('I want to drink alcohol.'),
      new UserTextMessage('Yes.'),
      new UserTextMessage('18.'),
    ]);

    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('I want to drink alcohol.'),
        new BotTextMessage('Do you really want to drink alcohol?'),
        new UserTextMessage('Yes.'),
        new BotTextMessage('How old are you?'),
        new UserTextMessage('18.'),
        new BotTextMessage('Here you are!'),
      ].map(msg => msg.toJson(userId)),
    );

    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);

    expect(user._userId).toBe(userId);
    expect(user._conversations.length).toBe(1);
    expect(dialogs.stack).toHaveLength(0);
    expect(dialogs.previous.length).toBe(1);
    expect(dialogs.previous[0].name).toBe('alcohol');
    expect(await bot.brain.userGet(userId, 'isAlcoholDialogCompleted')).toBe(true);
  });
});
