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

const {
  Bot,
  BotTextMessage,
  UserTextMessage,
} = require('botfuel-dialog');
const config = require('../test-config');

describe('Qna', () => {
  test('should respond when not understood', async () => {
    const bot = new Bot(config);
    const { adapter } = bot;
    const { userId } = adapter;
    await bot.play([new UserTextMessage('I love Paris')]);
    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('I love Paris'),
        new BotTextMessage(
          'I’m sorry, I did not understand your question. Please reach us at contact@my-sample-compagny.com for further assistance.',
        ),
      ].map(msg => msg.toJson(userId)),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user._userId).toBe(userId);
    expect(user._conversations.length).toBe(1);
    expect(dialogs.stack).toHaveLength(0);
    expect(dialogs.previous.length).toBe(1);
    expect(dialogs.previous[0].name).toBe('default');
  });

  test('should respond to help request', async () => {
    const bot = new Bot(config);
    const { adapter } = bot;
    const { userId } = adapter;
    await bot.play([new UserTextMessage('Can you help me?')]);
    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('Can you help me?'),
        new BotTextMessage(
          'Hello! I can provide you with information about our payment and shipping policies.',
        ),
      ].map(msg => msg.toJson(userId)),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user._userId).toBe(userId);
    expect(user._conversations.length).toBe(1);
    expect(dialogs.stack.length).toBe(0);
    expect(dialogs.previous.length).toBe(1);
    expect(dialogs.previous[0].name).toBe('qnas');
  });

  test('should respond to invoice question', async () => {
    const bot = new Bot(config);
    const { adapter } = bot;
    const { userId } = adapter;
    await bot.play([new UserTextMessage('Could you send me an invoice please?')]);
    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('Could you send me an invoice please?'),
        new BotTextMessage(
          'The invoice for your purchase will be sent along with your goods. You can also download an electronic version from your account.',
        ),
      ].map(msg => msg.toJson(userId)),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user._userId).toBe(userId);
    expect(user._conversations.length).toBe(1);
    expect(dialogs.stack.length).toBe(0);
    expect(dialogs.previous.length).toBe(1);
    expect(dialogs.previous[0].name).toBe('qnas');
  });

  test('should respond to assistance need', async () => {
    const bot = new Bot(config);
    const { adapter } = bot;
    const { userId } = adapter;
    await bot.play([new UserTextMessage('A have a problem on the website.')]);
    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('A have a problem on the website.'),
        new BotTextMessage(
          'Please reach us at contact@my-sample-compagny.com for further assistance.',
        ),
      ].map(msg => msg.toJson(userId)),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user._userId).toBe(userId);
    expect(user._conversations.length).toBe(1);
    expect(dialogs.stack.length).toBe(0);
    expect(dialogs.previous.length).toBe(1);
    expect(dialogs.previous[0].name).toBe('qnas');
  });

  test('should respond question about payment options', async () => {
    const bot = new Bot(config);
    const { adapter } = bot;
    const { userId } = adapter;
    await bot.play([new UserTextMessage('Can I pay in bitcoins?')]);
    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('Can I pay in bitcoins?'),
        new BotTextMessage(
          'You can pay for your purchase with Visa, Mastercard or using a PayPal account.',
        ),
      ].map(msg => msg.toJson(userId)),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user._userId).toBe(userId);
    expect(user._conversations.length).toBe(1);
    expect(dialogs.stack.length).toBe(0);
    expect(dialogs.previous.length).toBe(1);
    expect(dialogs.previous[0].name).toBe('qnas');
  });

  test('should respond to question about shipping policy', async () => {
    const bot = new Bot(config);
    const { adapter } = bot;
    const { userId } = adapter;
    await bot.play([new UserTextMessage('Do you ship to France?')]);
    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('Do you ship to France?'),
        new BotTextMessage(
          'Your purchase can be shipped worldwide. However, delivery charges may vary.',
        ),
      ].map(msg => msg.toJson(userId)),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user._userId).toBe(userId);
    expect(user._conversations.length).toBe(1);
    expect(dialogs.stack.length).toBe(0);
    expect(dialogs.previous.length).toBe(1);
    expect(dialogs.previous[0].name).toBe('qnas');
  });
});
