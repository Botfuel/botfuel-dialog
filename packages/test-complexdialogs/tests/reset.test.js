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

const expect = require('expect.js');
const { Bot, BotTextMessage, UserTextMessage } = require('botfuel-dialog');
const config = require('../test-config');

describe('ResetDialog', () => {
  it('should have the proper interaction when the user reset to greetings dialog', async function () {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([
      new UserTextMessage('My name is John'),
      new UserTextMessage('reset'),
    ]);
    expect(bot.adapter.log).to.eql([
      new UserTextMessage('My name is John'),
      new BotTextMessage('Entities defined: name'),
      new UserTextMessage('reset'),
      new BotTextMessage('A new conversation has started!'),
      new BotTextMessage('Hello human!'),
    ].map(msg => msg.toJson(userId)));
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user.conversations.length).to.be(2);
    expect(dialogs.stack).to.be.empty();
  });
});
