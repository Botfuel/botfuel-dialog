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

const {
  Bot,
  BotTextMessage,
  BotImageMessage,
  UserTextMessage,
  CardsMessage,
  PostbackMessage,
  Card,
  Link,
  Postback,
  WebAdapter,
} = require('botfuel-dialog');
const config = require('../test-config');

describe('Products', () => {
  test('should understand the click on the buy button', async () => {
    const bot = new Bot(config);
    const { adapter } = bot;
    const { userId } = adapter;
    await bot.play([
      new UserTextMessage('Show me the products.'),
      new PostbackMessage({ name: 'products', data: { messageEntities: [{ dim: 'product', values: ['top hat'] }] } }),
    ]);
    expect(bot.adapter.log[0]).toEqual(new UserTextMessage('Show me the products.').toJson(userId));
    expect(bot.adapter.log[1]).toEqual(
      new BotTextMessage('Which product do you want to buy?').toJson(userId),
    );
    expect(bot.adapter.log[2]).toEqual(
      new CardsMessage([
        new Card('Top hat', WebAdapter.getStaticUrl('images/tophat.jpg'), [
          new Link('Details', 'https://www.amazon.com/Beistle-Satin-Sleek-Top-Hat/dp/B0051BH6IM'),
          new Postback('Buy', { name: 'products', data: { messageEntities: [{ dim: 'product', values: ['top hat'] }] } }),
        ]),
        new Card('Cowboy hat', WebAdapter.getStaticUrl('images/cowboyhat.jpg'), [
          new Link(
            'Details',
            'https://www.amazon.co.uk/Leather-Australian-Cowboy-Aussie-brown/dp/B0094J2H0O',
          ),
          new Postback('Buy', { name: 'products', data: { messageEntities: [{ dim: 'product', values: ['cowboy hat'] }] } }),
        ]),
        new Card('Detective hat', WebAdapter.getStaticUrl('images/detectivehat.jpg'), [
          new Link(
            'Details',
            'https://www.amazon.com/Unisex-Sherlock-Holmes-Detective-Deerstalker/dp/B016A3J3N0',
          ),
          new Postback('Buy', { name: 'products', data: { messageEntities: [{ dim: 'product', values: ['detective hat'] }] } }),
        ]),
      ]).toJson(userId),
    );
    expect(bot.adapter.log[3]).toEqual(
      new PostbackMessage({ name: 'products', data: { messageEntities: [{ dim: 'product', values: ['top hat'] }] } }).toJson(userId),
    );
    expect(bot.adapter.log[4]).toEqual(
      new BotImageMessage(
        WebAdapter.getImageUrl('product_order_confirm.handlebars', {
          productName: 'Top hat',
          productImage: 'images/tophat.jpg',
        }),
      ).toJson(userId),
    );
    expect(bot.adapter.log[5]).toEqual(
      new BotTextMessage('You just bought the Top hat, good choice!').toJson(userId),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user._userId).toBe(userId);
    expect(user._conversations.length).toBe(1);
    expect(dialogs.stack).toHaveLength(0);
    expect(dialogs.previous.length).toBe(1);
    expect(dialogs.previous[0].name).toBe('products');
  });
});
