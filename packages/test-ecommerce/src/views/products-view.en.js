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

const {
  PromptView,
  BotTextMessage,
  BotImageMessage,
  Card,
  Link,
  Postback,
  CardsMessage,
  WebAdapter,
} = require('botfuel-dialog');
const PRODUCTS = require('../../PRODUCTS.json');

const productToCard = (key, product) =>
  new Card(product.title, WebAdapter.getStaticUrl(product.imageUrl), [
    new Link('Details', product.link),
    new Postback('Buy', 'products', [{ dim: 'product', values: [key] }]),
  ]);

class ProductsView extends PromptView {
  renderEntities(messageEntities, missingEntities) {
    const messages = [];

    if (messageEntities.product) {
      const productName = messageEntities.product.values[0];

      messages.push(
        new BotImageMessage(
          WebAdapter.getTemplateImageUrl('product_order_confirm.handlebars', {
            productName,
            productImage: PRODUCTS[productName].imageUrl,
          }),
        ),
      );

      messages.push(new BotTextMessage(`You just bought the ${productName}, good choice!`));
    }

    if (missingEntities.product) {
      messages.push(new BotTextMessage('Which product do you want to buy?'));
      messages.push(ProductsView.getCardsProducts());
    }

    return messages;
  }

  static getCardsProducts() {
    return new CardsMessage(
      ['top hat', 'cowboy hat', 'detective hat'].map(key => productToCard(key, PRODUCTS[key])),
    );
  }
}

module.exports = ProductsView;
