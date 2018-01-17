/* eslint prefer-arrow-callback: "off" */

const expect = require('expect.js');
const {
  Bot,
  BotTextMessage,
  UserTextMessage,
  CardsMessage,
  PostbackMessage,
  Card,
  Link,
  Postback,
} = require('botfuel-dialog');
const config = require('../test-config');

describe('Products', function () {
  it('should understand the click on the buy button', async function () {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([
      new UserTextMessage('Show me the products.'),
      new PostbackMessage('products', [{ dim: 'product', values: ['top hat'] }]),
    ]);
    expect(bot.adapter.log[0]).to.eql(new UserTextMessage('Show me the products.').toJson(userId));
    expect(bot.adapter.log[1]).to.eql(
      new BotTextMessage('Which product do you want to buy?').toJson(userId),
    );
    expect(bot.adapter.log[2]).to.eql(
      new CardsMessage([
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
            new Link(
              'Details',
              'https://www.amazon.co.uk/Leather-Australian-Cowboy-Aussie-brown/dp/B0094J2H0O',
            ),
            new Postback('Buy', 'products', [{ dim: 'product', values: ['cowboy hat'] }]),
          ],
        ),
        new Card(
          'Detective hat',
          'https://images-na.ssl-images-amazon.com/images/I/71DyzluYzQL._UL1001_.jpg',
          [
            new Link(
              'Details',
              'https://www.amazon.com/Unisex-Sherlock-Holmes-Detective-Deerstalker/dp/B016A3J3N0',
            ),
            new Postback('Buy', 'products', [{ dim: 'product', values: ['detective hat'] }]),
          ],
        ),
      ]).toJson(userId),
    );
    expect(bot.adapter.log[3]).to.eql(
      new PostbackMessage('products', [{ dim: 'product', values: ['top hat'] }]).toJson(userId),
    );
    expect(bot.adapter.log[4]).to.eql(
      new BotTextMessage('You just bought the top hat, good choice!').toJson(userId),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user.userId).to.be(userId);
    expect(user.conversations.length).to.be(1);
    expect(dialogs.stack).to.be.empty();
    expect(dialogs.previous.length).to.be(1);
    expect(dialogs.previous[0].name).to.be('products');
  });
});
