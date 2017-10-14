/* eslint-disable prefer-arrow-callback */

const expect = require('expect.js');
const MessengerAdapter = require('../../src/adapters/messenger_adapter');
const CardsMessage = require('../../src/views/parts/cards_message');
const Card = require('../../src/views/parts/card');
const Link = require('../../src/views/parts/link');
const Postback = require('../../src/views/parts/postback');

describe('MessengerAdapter', function () {
  it.only('should generate the proper json', async function () {
    const adapter = new MessengerAdapter(null, null);
    const message = new CardsMessage('BOT_ID', 'USER_ID', [
      new Card('Card 1', 'https://image1.jpg', [
        new Link('Details', 'https://image1'),
        new Postback('Buy', 'products', [{ dim: 'product', value: '1' }]),
      ]),
      new Card('Card 2', 'https://image2.jpg', [
        new Link('Details', 'https://image2'),
        new Postback('Buy', 'products', [{ dim: 'product', value: '2' }]),
      ]),
    ]);
    const json = message.toJson();
    const messengerJson = adapter.adapt(json);
    expect(messengerJson).to.eql({

    });
  });
});
