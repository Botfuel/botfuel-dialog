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
// const Replay = require('replay');
const config = require('../test-config');

describe('TravelDialog', () => {
  test('should have the proper interaction when the user gives the destination', async () => {
    const bot = new Bot(config);
    const { adapter } = bot;
    const { userId } = adapter;
    await bot.play([new UserTextMessage('I leave from Paris')]);
    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('I leave from Paris'),
        new BotTextMessage('Entities defined: city'),
        new BotTextMessage('Entities needed: time'),
        new BotTextMessage('Which time?'),
      ].map(msg => msg.toJson(userId)),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    const lastConversation = await bot.brain.fetchLastConversation(userId);
    expect(user._conversations.length).toBe(1);
    expect(dialogs.stack.length).toBe(1);
    expect(lastConversation).toHaveProperty('travel');
    expect(lastConversation.travel._entities).toHaveProperty('city');
    expect(lastConversation.travel._entities.city.values[0].value).toBe('Paris');
  });

  test('should have the proper interaction when the user gives the destination then the date', async () => {
    const bot = new Bot(config);
    const { adapter } = bot;
    const { userId } = adapter;
    await bot.play([new UserTextMessage('I leave from Paris'), new UserTextMessage('tomorrow')]);
    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('I leave from Paris'),
        new BotTextMessage('Entities defined: city'),
        new BotTextMessage('Entities needed: time'),
        new BotTextMessage('Which time?'),
        new UserTextMessage('tomorrow'),
        new BotTextMessage('Entities defined: city, time'),
      ].map(msg => msg.toJson(userId)),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    const lastConversation = await bot.brain.fetchLastConversation(userId);
    expect(user._conversations.length).toBe(1);
    expect(dialogs.stack).toHaveLength(0);
    expect(lastConversation).toHaveProperty('travel');
    expect(lastConversation.travel._entities).toHaveProperty('city');
    expect(lastConversation.travel._entities).toHaveProperty('time');
    expect(lastConversation.travel._entities.city.values[0].value).toBe('Paris');
    expect(lastConversation.travel._entities.time.body).toBe('tomorrow');
  });

  test('should have the proper interaction when the user gives the destination twice', async () => {
    const bot = new Bot(config);
    const { adapter } = bot;
    const { userId } = adapter;
    await bot.play([
      new UserTextMessage('I leave from Paris'),
      new UserTextMessage('Actually, I leave from Berlin'),
      new UserTextMessage('tomorrow'),
    ]);
    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('I leave from Paris'),
        new BotTextMessage('Entities defined: city'),
        new BotTextMessage('Entities needed: time'),
        new BotTextMessage('Which time?'),
        new UserTextMessage('Actually, I leave from Berlin'),
        new BotTextMessage('Entities defined: city'),
        new BotTextMessage('Entities needed: time'),
        new BotTextMessage('Which time?'),
        new UserTextMessage('tomorrow'),
        new BotTextMessage('Entities defined: city, time'),
      ].map(msg => msg.toJson(userId)),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    const lastConversation = await bot.brain.fetchLastConversation(userId);
    expect(user._conversations.length).toBe(1);
    expect(dialogs.stack).toHaveLength(0);
    expect(lastConversation).toHaveProperty('travel');
    expect(lastConversation.travel._entities).toHaveProperty('city');
    expect(lastConversation.travel._entities).toHaveProperty('time');
    expect(lastConversation.travel._entities.city).toHaveProperty('body');
    expect(lastConversation.travel._entities.city.values[0].value).toBe('Berlin');
    expect(lastConversation.travel._entities.time.body).toBe('tomorrow');
  });

  test('should have the proper interaction when the user gives the date twice', async () => {
    const bot = new Bot(config);
    const { adapter } = bot;
    const { userId } = adapter;
    await bot.play([
      new UserTextMessage('I leave from Paris'),
      new UserTextMessage('tomorrow'),
      new UserTextMessage('the day after tomorrow'),
    ]);
    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('I leave from Paris'),
        new BotTextMessage('Entities defined: city'),
        new BotTextMessage('Entities needed: time'),
        new BotTextMessage('Which time?'),
        new UserTextMessage('tomorrow'),
        new BotTextMessage('Entities defined: city, time'),
        new UserTextMessage('the day after tomorrow'),
        new BotTextMessage('Entities defined: city, time'),
      ].map(msg => msg.toJson(userId)),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    const lastConversation = await bot.brain.fetchLastConversation(userId);
    expect(user._conversations.length).toBe(1);
    expect(dialogs.stack).toHaveLength(0);
    expect(lastConversation).toHaveProperty('travel');
    expect(lastConversation.travel._entities).toHaveProperty('city');
    expect(lastConversation.travel._entities).toHaveProperty('time');
    expect(lastConversation.travel._entities.city).toHaveProperty('body');
    expect(lastConversation.travel._entities.city.values[0].value).toBe('Paris');
    expect(lastConversation.travel._entities.time.body).toBe('the day after tomorrow');
  });

  test('should trigger default dialog when same dialog is triggered twice without entities', async () => {
    const bot = new Bot(config);
    const { adapter } = bot;
    const { userId } = adapter;
    await bot.play([
      new UserTextMessage('I leave from Paris'),
      new UserTextMessage('I am leaving'),
    ]);
    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('I leave from Paris'),
        new BotTextMessage('Entities defined: city'),
        new BotTextMessage('Entities needed: time'),
        new BotTextMessage('Which time?'),
        new UserTextMessage('I am leaving'),
        new BotTextMessage('Not understood.'),
        new BotTextMessage('Entities defined: city'),
        new BotTextMessage('Entities needed: time'),
        new BotTextMessage('Which time?'),
      ].map(msg => msg.toJson(userId)),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user._conversations.length).toBe(1);
    expect(dialogs.stack).toHaveLength(1);
    expect(dialogs.previous).toHaveLength(1);
  });
});
