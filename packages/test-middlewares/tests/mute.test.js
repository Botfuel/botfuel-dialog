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
/* eslint prefer-arrow-callback: 'off' */

const { Bot, BotTextMessage, UserTextMessage } = require('botfuel-dialog');
const config = require('../test-config');

describe('Mute', () => {
  test('should mute the bot', async () => {
    const bot = new Bot(config);
    const { adapter } = bot;
    const { userId } = adapter;
    await bot.play([new UserTextMessage('Mute'), new UserTextMessage("What's up")]);
    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('Mute'),
        new BotTextMessage('Muted!'),
        new UserTextMessage("What's up"),
      ].map(msg => msg.toJson(userId)),
    );
    const isMuted = await bot.brain.userGet(userId, '_isMuted');
    expect(isMuted).toBe(true);
  });
});
