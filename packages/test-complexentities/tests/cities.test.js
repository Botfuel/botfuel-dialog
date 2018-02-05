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

const expect = require('expect.js');
const { Bot, BotTextMessage, UserTextMessage } = require('botfuel-dialog');
const config = require('../test-config');

describe('CitiesDialog', () => {
  it('should keep prompting until it has all 5 cities', async () => {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([
      new UserTextMessage('My favorite cities are Paris and Marseille'),
      new UserTextMessage('Toulouse'),
      new UserTextMessage('Lille'),
      new UserTextMessage('Lyon'),
    ]);
    expect(bot.adapter.log).to.eql(
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
    expect(user.conversations.length).to.be(1);
    expect(dialogs.stack).to.be.empty();
    const lastConversation = await bot.brain.getLastConversation(userId);
    expect(lastConversation).to.have.property('cities');
    expect(lastConversation.cities).to.have.property('favoriteCities');
    expect(lastConversation.cities.favoriteCities).to.have.length(5);
  });

  it('should replace cities with a new list if it already has 5 cities', async () => {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([
      new UserTextMessage('My favorite cities are Paris and Marseille'),
      new UserTextMessage('Toulouse'),
      new UserTextMessage('Lille'),
      new UserTextMessage('Lyon'),
      new UserTextMessage('My favorite cities are Paris and Nice'),
    ]);
    expect(bot.adapter.log).to.eql(
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
    expect(user.conversations.length).to.be(1);
    expect(dialogs.stack).to.not.be.empty();
    const lastConversation = await bot.brain.getLastConversation(userId);
    expect(lastConversation).to.have.property('cities');
    expect(lastConversation.cities).to.have.property('favoriteCities');
    expect(lastConversation.cities.favoriteCities).to.have.length(2);
  });
});
