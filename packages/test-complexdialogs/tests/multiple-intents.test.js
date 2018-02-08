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

describe('Multiple intents', () => {
  test(
    'should understand multiple one-turn intents in the same sentence',
    async () => {
      const bot = new Bot(config);
      const userId = bot.adapter.userId;
      await bot.play([new UserTextMessage('Hello bot. This is great.')]);
      expect(bot.adapter.log).toEqual([
        new UserTextMessage('Hello bot. This is great.'),
        new BotTextMessage('Hello human!'),
        new BotTextMessage("You're welcome!"),
      ].map(msg => msg.toJson(userId)));
      const user = await bot.brain.getUser(userId);
      const dialogs = await bot.brain.getDialogs(userId);
      expect(user.conversations.length).toBe(1);
      expect(dialogs.stack.length).toBe(0);
      expect(dialogs.previous.length).toBe(2);
    }
  );

  test(
    'should understand multiple intents in the same sentence',
    async () => {
      const bot = new Bot(config);
      const userId = bot.adapter.userId;
      await bot.play([new UserTextMessage('Hello bot. I leave from Paris.')]);
      expect(bot.adapter.log).toEqual([
        new UserTextMessage('Hello bot. I leave from Paris.'),
        new BotTextMessage('Hello human!'),
        new BotTextMessage('Entities defined: city'),
        new BotTextMessage('Entities needed: time'),
        new BotTextMessage('Which time?'),
      ].map(msg => msg.toJson(userId)));
      const user = await bot.brain.getUser(userId);
      const dialogs = await bot.brain.getDialogs(userId);
      expect(user.conversations.length).toBe(1);
      expect(dialogs.stack.length).toBe(1);
      expect(dialogs.previous.length).toBe(1);
    }
  );

  test(
    'should understand two prompts in the same sentence (1)',
    async () => {
      const bot = new Bot(config);
      const userId = bot.adapter.userId;
      await bot.play([
        new UserTextMessage('I leave tomorrow from Paris. I want to buy a car.'),
        new UserTextMessage('Yes'),
      ]);
      expect(bot.adapter.log).toEqual([
        new UserTextMessage('I leave tomorrow from Paris. I want to buy a car.'),
        new BotTextMessage('Entities defined: time, city'),
        new BotTextMessage('Do you still want to purchase a car?'),
        new UserTextMessage('Yes'),
        new BotTextMessage('You still want to purchase a car.'),
        new BotTextMessage('Entities defined: '),
        new BotTextMessage('Entities needed: color, transmission'),
        new BotTextMessage('Which color?'),
      ].map(msg => msg.toJson(userId)));
      const user = await bot.brain.getUser(userId);
      const dialogs = await bot.brain.getDialogs(userId);
      expect(user.conversations.length).toBe(1);
      expect(dialogs.stack.length).toBe(1);
      expect(dialogs.previous.length).toBe(2);
    }
  );

  test(
    'should understand two prompts in the same sentence (2)',
    async () => {
      const bot = new Bot(config);
      const userId = bot.adapter.userId;
      await bot.play([
        new UserTextMessage('I leave from Paris. I want to buy a car.'),
        new UserTextMessage('tomorrow'),
        new UserTextMessage('Yes'),
      ]);
      expect(bot.adapter.log).toEqual([
        new UserTextMessage('I leave from Paris. I want to buy a car.'),
        new BotTextMessage('Entities defined: city'),
        new BotTextMessage('Entities needed: time'),
        new BotTextMessage('Which time?'),
        new UserTextMessage('tomorrow'),
        new BotTextMessage('Entities defined: time, city'),
        new BotTextMessage('Do you still want to purchase a car?'),
        new UserTextMessage('Yes'),
        new BotTextMessage('You still want to purchase a car.'),
        new BotTextMessage('Entities defined: '),
        new BotTextMessage('Entities needed: color, transmission'),
        new BotTextMessage('Which color?'),
      ].map(msg => msg.toJson(userId)));
      const user = await bot.brain.getUser(userId);
      const dialogs = await bot.brain.getDialogs(userId);
      expect(user.conversations.length).toBe(1);
      expect(dialogs.stack.length).toBe(1);
      expect(dialogs.previous.length).toBe(2);
    }
  );

  test('should forget about previous confirmation', async () => {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play(
      [
        new UserTextMessage('I leave from Paris. I want to buy a car.'),
        new UserTextMessage('tomorrow'),
        new UserTextMessage('No'),
        new UserTextMessage('I leave from Paris. I want to buy a car.'),
        new UserTextMessage('Yes'),
      ],
    );
    expect(bot.adapter.log).toEqual([
      new UserTextMessage('I leave from Paris. I want to buy a car.'),
      new BotTextMessage('Entities defined: city'),
      new BotTextMessage('Entities needed: time'),
      new BotTextMessage('Which time?'),
      new UserTextMessage('tomorrow'),
      new BotTextMessage('Entities defined: time, city'),
      new BotTextMessage('Do you still want to purchase a car?'),
      new UserTextMessage('No'),
      new BotTextMessage('You don’t want to purchase a car anymore.'),
      new UserTextMessage('I leave from Paris. I want to buy a car.'),
      new BotTextMessage('Entities defined: time, city'),
      new BotTextMessage('Do you still want to purchase a car?'),
      new UserTextMessage('Yes'),
      new BotTextMessage('You still want to purchase a car.'),
      new BotTextMessage('Entities defined: '),
      new BotTextMessage('Entities needed: color, transmission'),
      new BotTextMessage('Which color?'),
    ].map(msg => msg.toJson(userId)));
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user.conversations.length).toBe(1);
    expect(dialogs.stack.length).toBe(1);
    expect(dialogs.previous.length).toBe(4);
  });
});
