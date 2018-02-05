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

describe('ThanksDialog', () => {
  it('should understand when the user mispells', async function () {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([new UserTextMessage('Thenks')]);
    expect(bot.adapter.log).to.eql([
      new UserTextMessage('Thenks'),
      new BotTextMessage('You\'re welcome!'),
    ].map(msg => msg.toJson(userId)),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user.conversations.length).to.be(1);
    expect(dialogs.stack).to.be.empty();
    expect(dialogs.previous.length).to.be(1);
    expect(dialogs.previous[0].name).to.be('thanks');
  });
});
