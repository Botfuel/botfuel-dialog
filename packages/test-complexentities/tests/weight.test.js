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

describe('WeightDialog', () => {
  test('should replace the highest priority entity when all are fulfilled', async () => {
    const bot = new Bot(config);
    const { adapter } = bot;
    const { userId } = adapter;
    await bot.play([
      new UserTextMessage('I weigh 77kg'),
      new UserTextMessage('88kg'),
      new UserTextMessage('99kg'),
      new UserTextMessage('I weigh 7kg'),
    ]);
    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('I weigh 77kg'),
        new BotTextMessage('Cool, so you weigh 77'),
        new BotTextMessage('What about your male genitor?'),
        new UserTextMessage('88kg'),
        new BotTextMessage('Cool, so you weigh 77'),
        new BotTextMessage('Cool, so your male genitor weighs 88'),
        new BotTextMessage('What about your female genitor?'),
        new UserTextMessage('99kg'),
        new BotTextMessage('Cool, so you weigh 77'),
        new BotTextMessage('Cool, so your male genitor weighs 88'),
        new BotTextMessage('Cool, so your female genitor weighs 99'),
        new BotTextMessage('Your family is pretty heavy...'),
        new BotTextMessage('Your female genitor especially!'),
        new UserTextMessage('I weigh 7kg'),
        new BotTextMessage('Cool, so you weigh 7'),
        new BotTextMessage('Cool, so your male genitor weighs 88'),
        new BotTextMessage('Cool, so your female genitor weighs 99'),
        new BotTextMessage('Your family is pretty average.'),
      ].map(msg => msg.toJson(userId)),
    );
  });
});
