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

const { Bot, BotImageMessage, UserTextMessage, WebAdapter } = require('botfuel-dialog');
const PRODUCTS = require('../PRODUCTS.json');
const config = require('../test-config');

describe('SingleProductDialog', () => {
  Object.keys(PRODUCTS).map((key) => {
    const bot = new Bot(config);
    const { adapter } = bot;
    const { userId } = adapter;
    const product = PRODUCTS[key];
    return test(`should show the ${key} image`, async () => {
      await bot.play([new UserTextMessage(`Show me the ${key}.`)]);
      expect(bot.adapter.log).toEqual(
        [
          new UserTextMessage(`Show me the ${key}.`),
          new BotImageMessage(WebAdapter.getStaticUrl(product.imageUrl)),
        ].map(msg => msg.toJson(userId)),
      );
    });
  });
});
