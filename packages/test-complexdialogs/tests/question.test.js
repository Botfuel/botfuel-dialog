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

describe('Question', () => {
  test('should complete dialog if the first answer is no', async () => {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;

    await bot.play([new UserTextMessage('Ask me a question.'), new UserTextMessage('No.')]);

    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('Ask me a question.'),
        new BotTextMessage('Would you like a second question?'),
        new UserTextMessage('No.'),
        new BotTextMessage('Okay, I’ll stop bothering you.'),
      ].map(msg => msg.toJson(userId)),
    );

    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);

    expect(user.userId).toBe(userId);
    expect(user.conversations.length).toBe(1);
    expect(dialogs.stack).toHaveLength(0);
    expect(dialogs.previous.length).toBe(1);
    expect(dialogs.previous[0].name).toBe('question');
    expect(await bot.brain.userGet(user.userId, 'isQuestionDialogCompleted')).toBe(true);
  });

  test('should ask the second question if the first answer is yes', async () => {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;

    await bot.play([
      new UserTextMessage('Ask me a question.'),
      new UserTextMessage('Yes.'),
      new UserTextMessage('Yes.'),
    ]);

    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('Ask me a question.'),
        new BotTextMessage('Would you like a second question?'),
        new UserTextMessage('Yes.'),
        new BotTextMessage('Can you answer by yes or no?'),
        new UserTextMessage('Yes.'),
        new BotTextMessage('You said yes!'),
      ].map(msg => msg.toJson(userId)),
    );

    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);

    expect(user.userId).toBe(userId);
    expect(user.conversations.length).toBe(1);
    expect(dialogs.stack).toHaveLength(0);
    expect(dialogs.previous.length).toBe(1);
    expect(dialogs.previous[0].name).toBe('question');
    expect(await bot.brain.userGet(user.userId, 'isQuestionDialogCompleted')).toBe(true);
  });
});
