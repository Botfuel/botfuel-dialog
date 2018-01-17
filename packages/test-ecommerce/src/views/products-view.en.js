const {
  PromptView,
  BotTextMessage,
  Card,
  Link,
  Postback,
  CardsMessage,
} = require('botfuel-dialog');

class ProductsView extends PromptView {
  renderEntities(messageEntities, missingEntities) {
    const messages = [];

    if (messageEntities.product) {
      messages.push(
        new BotTextMessage(`You just bought the ${messageEntities.product.values[0]}, good choice!`),
      );
    }

    if (missingEntities.product) {
      messages.push(new BotTextMessage('Which product do you want to buy?'));
      messages.push(ProductsView.getCardsProducts());
    }

    return messages;
  }

  static getCardsProducts() {
    return new CardsMessage(
      [
        new Card(
          'Top hat',
          'https://images-na.ssl-images-amazon.com/images/I/51qyodDiK-L._SY355_.jpg',
          [
            new Link('Details', 'https://www.amazon.com/Beistle-Satin-Sleek-Top-Hat/dp/B0051BH6IM'),
            new Postback('Buy', 'products', [{ dim: 'product', values: ['top hat'] }]),
          ],
        ),
        new Card(
          'Cowboy hat',
          'https://images-na.ssl-images-amazon.com/images/I/71NAi8yEZRL._UX522_.jpg',
          [
            new Link('Details', 'https://www.amazon.co.uk/Leather-Australian-Cowboy-Aussie-brown/dp/B0094J2H0O'),
            new Postback('Buy', 'products', [{ dim: 'product', values: ['cowboy hat'] }]),
          ],
        ),
        new Card(
          'Detective hat',
          'https://images-na.ssl-images-amazon.com/images/I/71DyzluYzQL._UL1001_.jpg',
          [
            new Link('Details', 'https://www.amazon.com/Unisex-Sherlock-Holmes-Detective-Deerstalker/dp/B016A3J3N0'),
            new Postback('Buy', 'products', [{ dim: 'product', values: ['detective hat'] }]),
          ],
        ),
      ],
    );
  }
}

module.exports = ProductsView;
