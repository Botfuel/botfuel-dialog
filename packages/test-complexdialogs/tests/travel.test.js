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

describe('TravelDialog', () => {
  it('should have the proper interaction when the user gives the destination', async function () {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([
      new UserTextMessage('I leave from Paris'),
    ]);
    expect(bot.adapter.log).to.eql([
      new UserTextMessage('I leave from Paris'),
      new BotTextMessage('Entities defined: city'),
      new BotTextMessage('Entities needed: time'),
      new BotTextMessage('Which time?'),
    ].map(msg => msg.toJson(userId)));
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    const lastConversation = await bot.brain.getLastConversation(userId);
    expect(user.conversations.length).to.be(1);
    expect(dialogs.stack.length).to.be(1);
    expect(lastConversation).to.have.property('travel');
    expect(lastConversation.travel).to.have.property('city');
    expect(lastConversation.travel.city.body).to.be('Paris');
  });

  it('should have the proper interaction when the user gives the destination then the date', async function () {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([
      new UserTextMessage('I leave from Paris'),
      new UserTextMessage('tomorrow'),
    ]);
    expect(bot.adapter.log).to.eql([
      new UserTextMessage('I leave from Paris'),
      new BotTextMessage('Entities defined: city'),
      new BotTextMessage('Entities needed: time'),
      new BotTextMessage('Which time?'),
      new UserTextMessage('tomorrow'),
      new BotTextMessage('Entities defined: time, city'),
    ].map(msg => msg.toJson(userId)));
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    const lastConversation = await bot.brain.getLastConversation(userId);
    expect(user.conversations.length).to.be(1);
    expect(dialogs.stack).to.be.empty();
    expect(lastConversation).to.have.property('travel');
    expect(lastConversation.travel).to.have.property('city');
    expect(lastConversation.travel).to.have.property('time');
    expect(lastConversation.travel.city.body).to.be('Paris');
    expect(lastConversation.travel.time.body).to.be('tomorrow');
  });

  it('should have the proper interaction when the user gives the destination twice', async function () {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([
      new UserTextMessage('I leave from Paris'),
      new UserTextMessage('Actually, I leave from Berlin'),
      new UserTextMessage('tomorrow'),
    ]);
    expect(bot.adapter.log).to.eql([
      new UserTextMessage('I leave from Paris'),
      new BotTextMessage('Entities defined: city'),
      new BotTextMessage('Entities needed: time'),
      new BotTextMessage('Which time?'),
      new UserTextMessage('Actually, I leave from Berlin'),
      new BotTextMessage('Entities defined: city'),
      new BotTextMessage('Entities needed: time'),
      new BotTextMessage('Which time?'),
      new UserTextMessage('tomorrow'),
      new BotTextMessage('Entities defined: time, city'),
    ].map(msg => msg.toJson(userId)));
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    const lastConversation = await bot.brain.getLastConversation(userId);
    expect(user.conversations.length).to.be(1);
    expect(dialogs.stack).to.be.empty();
    expect(lastConversation).to.have.property('travel');
    expect(lastConversation.travel).to.have.property('city');
    expect(lastConversation.travel).to.have.property('time');
    expect(lastConversation.travel.city.body).to.be('Berlin');
    expect(lastConversation.travel.time.body).to.be('tomorrow');
  });

  it('should have the proper interaction when the user gives the date twice', async function () {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([
      new UserTextMessage('I leave from Paris'),
      new UserTextMessage('tomorrow'),
      new UserTextMessage('the day after tomorrow'),
    ]);
    expect(bot.adapter.log).to.eql([
      new UserTextMessage('I leave from Paris'),
      new BotTextMessage('Entities defined: city'),
      new BotTextMessage('Entities needed: time'),
      new BotTextMessage('Which time?'),
      new UserTextMessage('tomorrow'),
      new BotTextMessage('Entities defined: time, city'),
      new UserTextMessage('the day after tomorrow'),
      new BotTextMessage('Entities defined: time, city'),
    ].map(msg => msg.toJson(userId)));
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    const lastConversation = await bot.brain.getLastConversation(userId);
    expect(user.conversations.length).to.be(1);
    expect(dialogs.stack).to.be.empty();
    expect(lastConversation).to.have.property('travel');
    expect(lastConversation.travel).to.have.property('city');
    expect(lastConversation.travel).to.have.property('time');
    expect(lastConversation.travel.city.body).to.be('Paris');
    expect(lastConversation.travel.time.body).to.be('the day after tomorrow');
  });
});
