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

describe('Canceling', () => {
  test(
    'should cancel the previous dialog',
    async () => {
      const bot = new Bot(config);
      const { adapter } = bot;
      const { userId } = adapter;
      await bot.play([
        new UserTextMessage('I want to buy a blue car.'),
        new UserTextMessage('I want to cancel.'),
        new UserTextMessage('Yes.'),
      ]);
      expect(bot.adapter.log).toEqual(
        [
          new UserTextMessage('I want to buy a blue car.'),
          new BotTextMessage('Entities defined: color'),
          new BotTextMessage('Entities needed: transmission'),
          new BotTextMessage('Which transmission?'),
          new UserTextMessage('I want to cancel.'),
          new BotTextMessage('Are you sure you want to cancel?'),
          new UserTextMessage('Yes.'),
          new BotTextMessage('Dialog canceled!'),
        ].map(msg => msg.toJson(userId)),
      );
      const user = await bot.brain.getUser(userId);
      const dialogs = await bot.brain.getDialogs(userId);
      expect(user._userId).toBe(userId);
      expect(user._conversations.length).toBe(1);
      expect(dialogs.stack).toHaveLength(0);
      expect(dialogs.previous.length).toBe(1);
      expect(dialogs.previous[0].name).toBe('cancellation');
    },
    15000,
  );

  test(
    'should not cancel the previous dialog if user says no',
    async () => {
      const bot = new Bot(config);
      const { adapter } = bot;
      const { userId } = adapter;
      await bot.play([
        new UserTextMessage('I want to buy a blue car.'),
        new UserTextMessage('I want to cancel.'),
        new UserTextMessage('No.'),
      ]);
      expect(bot.adapter.log).toEqual(
        [
          new UserTextMessage('I want to buy a blue car.'),
          new BotTextMessage('Entities defined: color'),
          new BotTextMessage('Entities needed: transmission'),
          new BotTextMessage('Which transmission?'),
          new UserTextMessage('I want to cancel.'),
          new BotTextMessage('Are you sure you want to cancel?'),
          new UserTextMessage('No.'),
          new BotTextMessage('Resuming dialog...'),
          new BotTextMessage('Entities defined: color'),
          new BotTextMessage('Entities needed: transmission'),
          new BotTextMessage('Which transmission?'),
        ].map(msg => msg.toJson(userId)),
      );
      const user = await bot.brain.getUser(userId);
      const dialogs = await bot.brain.getDialogs(userId);
      expect(user._userId).toBe(userId);
      expect(user._conversations.length).toBe(1);
      expect(dialogs.stack).toHaveLength(1);
      expect(dialogs.previous.length).toBe(1);
      expect(dialogs.previous[0].name).toBe('cancellation');
    },
    15000,
  );

  test(
    'should reset memory of the cancel dialog if user already canceled once',
    async () => {
      const bot = new Bot(config);
      const { adapter } = bot;
      const { userId } = adapter;
      await bot.play([
        new UserTextMessage('I want to buy a blue car.'),
        new UserTextMessage('I want to cancel.'),
        new UserTextMessage('Yes.'),
        new UserTextMessage('I want to buy a blue car.'),
        new UserTextMessage('I want to cancel.'),
        new UserTextMessage('Yes.'),
      ]);
      expect(bot.adapter.log).toEqual(
        [
          new UserTextMessage('I want to buy a blue car.'),
          new BotTextMessage('Entities defined: color'),
          new BotTextMessage('Entities needed: transmission'),
          new BotTextMessage('Which transmission?'),
          new UserTextMessage('I want to cancel.'),
          new BotTextMessage('Are you sure you want to cancel?'),
          new UserTextMessage('Yes.'),
          new BotTextMessage('Dialog canceled!'),
          new UserTextMessage('I want to buy a blue car.'),
          new BotTextMessage('Entities defined: color'),
          new BotTextMessage('Entities needed: transmission'),
          new BotTextMessage('Which transmission?'),
          new UserTextMessage('I want to cancel.'),
          new BotTextMessage('Are you sure you want to cancel?'),
          new UserTextMessage('Yes.'),
          new BotTextMessage('Dialog canceled!'),
        ].map(msg => msg.toJson(userId)),
      );
      const user = await bot.brain.getUser(userId);
      const dialogs = await bot.brain.getDialogs(userId);
      expect(user._userId).toBe(userId);
      expect(user._conversations.length).toBe(1);
      expect(dialogs.stack).toHaveLength(0);
      expect(dialogs.previous.length).toBe(2);
      expect(dialogs.previous[0].name).toBe('cancellation');
      expect(dialogs.previous[1].name).toBe('cancellation');
    },
    15000,
  );
});
