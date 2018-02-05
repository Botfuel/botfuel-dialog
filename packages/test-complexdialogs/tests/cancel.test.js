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

describe('Canceling', function () {
  it('should cancel the previous dialog', async function () {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([
      new UserTextMessage('I want to buy a blue car.'),
      new UserTextMessage('I want to cancel.'),
      new UserTextMessage('Yes.'),
    ]);
    expect(bot.adapter.log).to.eql(
      [
        new UserTextMessage('I want to buy a blue car.'),
        new BotTextMessage('Entities defined: color'),
        new BotTextMessage('Entities needed: transmission'),
        new BotTextMessage('Which transmission?'),
        new UserTextMessage('I want to cancel.'),
        new BotTextMessage('Are you sure you want to cancel?'),
        new UserTextMessage('Yes.'),
        new BotTextMessage('Dialog canceled!'),
        new BotTextMessage('Hello human!'),
      ].map(msg => msg.toJson(userId)),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user.userId).to.be(userId);
    expect(user.conversations.length).to.be(1);
    expect(dialogs.stack).to.be.empty();
    expect(dialogs.previous.length).to.be(2);
    expect(dialogs.previous[0].name).to.be('cancel');
    expect(dialogs.previous[1].name).to.be('greetings');
  }, 15000);

  it('should not cancel the previous dialog if user says no', async function () {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([
      new UserTextMessage('I want to buy a blue car.'),
      new UserTextMessage('I want to cancel.'),
      new UserTextMessage('No.'),
    ]);
    expect(bot.adapter.log).to.eql(
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
    expect(user.userId).to.be(userId);
    expect(user.conversations.length).to.be(1);
    expect(dialogs.stack).to.have.length(1);
    expect(dialogs.previous.length).to.be(1);
    expect(dialogs.previous[0].name).to.be('cancel');
  }, 15000);

  it('should reset memory of the cancel dialog if user already canceled once', async function () {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([
      new UserTextMessage('I want to buy a blue car.'),
      new UserTextMessage('I want to cancel.'),
      new UserTextMessage('Yes.'),
      new UserTextMessage('I want to buy a blue car.'),
      new UserTextMessage('I want to cancel.'),
      new UserTextMessage('Yes.'),
    ]);
    expect(bot.adapter.log).to.eql(
      [
        new UserTextMessage('I want to buy a blue car.'),
        new BotTextMessage('Entities defined: color'),
        new BotTextMessage('Entities needed: transmission'),
        new BotTextMessage('Which transmission?'),
        new UserTextMessage('I want to cancel.'),
        new BotTextMessage('Are you sure you want to cancel?'),
        new UserTextMessage('Yes.'),
        new BotTextMessage('Dialog canceled!'),
        new BotTextMessage('Hello human!'),
        new UserTextMessage('I want to buy a blue car.'),
        new BotTextMessage('Entities defined: color'),
        new BotTextMessage('Entities needed: transmission'),
        new BotTextMessage('Which transmission?'),
        new UserTextMessage('I want to cancel.'),
        new BotTextMessage('Are you sure you want to cancel?'),
        new UserTextMessage('Yes.'),
        new BotTextMessage('Dialog canceled!'),
        new BotTextMessage('Hello again human!'),
      ].map(msg => msg.toJson(userId)),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user.userId).to.be(userId);
    expect(user.conversations.length).to.be(1);
    expect(dialogs.stack).to.be.empty();
    expect(dialogs.previous.length).to.be(4);
    expect(dialogs.previous[0].name).to.be('cancel');
    expect(dialogs.previous[1].name).to.be('greetings');
    expect(dialogs.previous[2].name).to.be('cancel');
    expect(dialogs.previous[3].name).to.be('greetings');
  }, 15000);
});
