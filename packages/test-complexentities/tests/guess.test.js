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

const { Bot, BotTextMessage, UserTextMessage } = require('botfuel-dialog');
const config = require('../test-config');

describe('GuessDialog', () => {
  test('should keep prompting until it has the right answer', async () => {
    const bot = new Bot(config);
    const { adapter } = bot;
    const { userId } = adapter;
    await bot.play([
      new UserTextMessage('Your favorite color is blue'),
      new UserTextMessage('Your favorite color is red'),
      new UserTextMessage('Your favorite color is green'),
    ]);
    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('Your favorite color is blue'),
        new BotTextMessage('Nope! Guess again.'),
        new UserTextMessage('Your favorite color is red'),
        new BotTextMessage('Congratulations! My favorite color is red.'),
        new UserTextMessage('Your favorite color is green'),
        new BotTextMessage('Nope! Guess again.'),
      ].map(msg => msg.toJson(userId)),
    );

    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user._conversations.length).toBe(1);
    expect(dialogs.stack).not.toHaveLength(0);
    const lastConversation = await bot.brain.fetchLastConversation(userId);
    expect(lastConversation).toHaveProperty('guess');
    expect(lastConversation.guess._entities).toHaveProperty('favoriteColor');
    expect(lastConversation.guess._entities.favoriteColor.values[0]).toHaveProperty('name');
  });
});
