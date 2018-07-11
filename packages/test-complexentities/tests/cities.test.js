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

describe('CitiesDialog', () => {
  test('should keep prompting until it has all 5 cities', async () => {
    const bot = new Bot(config);
    const { adapter } = bot;
    const { userId } = adapter;
    await bot.play([
      new UserTextMessage('My favorite cities are Paris and Marseille'),
      new UserTextMessage('Toulouse'),
      new UserTextMessage('Lille'),
      new UserTextMessage('Lyon'),
    ]);
    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('My favorite cities are Paris and Marseille'),
        new BotTextMessage('Cool, so you like Paris, Marseille'),
        new BotTextMessage('Can you give me 3 more cities you like?'),
        new UserTextMessage('Toulouse'),
        new BotTextMessage('Cool, so you like Paris, Marseille, Toulouse'),
        new BotTextMessage('Can you give me 2 more cities you like?'),
        new UserTextMessage('Lille'),
        new BotTextMessage('Cool, so you like Paris, Marseille, Toulouse, Lille'),
        new BotTextMessage('Can you give me 1 more cities you like?'),
        new UserTextMessage('Lyon'),
        new BotTextMessage('Cool, so you like Paris, Marseille, Toulouse, Lille, Lyon'),
      ].map(msg => msg.toJson(userId)),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user._conversations.length).toBe(1);
    expect(dialogs.stack).toHaveLength(0);
    const lastConversation = await bot.brain.fetchLastConversation(userId);
    expect(lastConversation).toHaveProperty('cities');
    expect(lastConversation.cities._entities).toHaveProperty('favoriteCities');
    expect(lastConversation.cities._entities.favoriteCities).toHaveLength(5);
  });

  test('should replace cities with a new list if it already has 5 cities', async () => {
    const bot = new Bot(config);
    const { adapter } = bot;
    const { userId } = adapter;
    await bot.play([
      new UserTextMessage('My favorite cities are Paris and Marseille'),
      new UserTextMessage('Toulouse'),
      new UserTextMessage('Lille'),
      new UserTextMessage('Lyon'),
      new UserTextMessage('My favorite cities are Paris and Nice'),
    ]);
    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('My favorite cities are Paris and Marseille'),
        new BotTextMessage('Cool, so you like Paris, Marseille'),
        new BotTextMessage('Can you give me 3 more cities you like?'),
        new UserTextMessage('Toulouse'),
        new BotTextMessage('Cool, so you like Paris, Marseille, Toulouse'),
        new BotTextMessage('Can you give me 2 more cities you like?'),
        new UserTextMessage('Lille'),
        new BotTextMessage('Cool, so you like Paris, Marseille, Toulouse, Lille'),
        new BotTextMessage('Can you give me 1 more cities you like?'),
        new UserTextMessage('Lyon'),
        new BotTextMessage('Cool, so you like Paris, Marseille, Toulouse, Lille, Lyon'),
        new UserTextMessage('My favorite cities are Paris and Nice'),
        new BotTextMessage('Cool, so you like Paris, Nice'),
        new BotTextMessage('Can you give me 3 more cities you like?'),
      ].map(msg => msg.toJson(userId)),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user._conversations.length).toBe(1);
    expect(dialogs.stack).not.toHaveLength(0);
    const lastConversation = await bot.brain.fetchLastConversation(userId);
    expect(lastConversation).toHaveProperty('cities');
    expect(lastConversation.cities._entities).toHaveProperty('favoriteCities');
    expect(lastConversation.cities._entities.favoriteCities).toHaveLength(2);
  });
});
