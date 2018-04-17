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
/* eslint prefer-arrow-callback: "off" */

const sinon = require('sinon');
const { Bot, BotTextMessage, UserTextMessage } = require('botfuel-dialog');
const config = require('../test-config');

const REFERENCE_INSTANT = new Date(2018, 0, 7, 15, 24, 13, 254);

describe('Delivery date', () => {
  test('should give expected delivery date', async () => {
    const clock = sinon.useFakeTimers(REFERENCE_INSTANT);
    const bot = new Bot(config);
    const { adapter } = bot;
    const { userId } = adapter;

    await bot.play([new UserTextMessage('What is the expected delivery date?')]);

    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('What is the expected delivery date?'),
        new BotTextMessage(
          'If you purchase today before 10pm, you purchase will be delivered by 2018-01-12.',
        ),
      ].map(msg => msg.toJson(userId)),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user._userId).toBe(userId);
    expect(user._conversations.length).toBe(1);
    expect(dialogs.stack).toHaveLength(0);
    expect(dialogs.previous.length).toBe(1);
    expect(dialogs.previous[0].name).toBe('delivery-date');

    clock.restore();
  });
});
