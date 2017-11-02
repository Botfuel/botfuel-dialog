/* eslint-disable prefer-arrow-callback */

const expect = require('expect.js');
const { Card, CardsMessage, Link, Postback } = require('../../src/messages');

describe('CardsMessage', function () {
  it('should generate the proper json', async function () {
    const message = new CardsMessage('USER_ID', [
      new Card('Card 1', 'https://image1.jpg', [
        new Link('Details', 'https://image1'),
        new Postback('Buy', 'products', [{ dim: 'product', value: '1' }]),
      ]),
      new Card('Card 2', 'https://image2.jpg', [
        new Link('Details', 'https://image2'),
        new Postback('Buy', 'products', [{ dim: 'product', value: '2' }]),
      ]),
    ]);
    expect(message.toJson()).to.eql({
      type: 'cards',
      sender: 'bot',
      bot: process.env.BOT_ID,
      user: 'USER_ID',
      payload: {
        value: [
          {
            buttons: [
              {
                text: 'Details',
                type: 'link',
                value: 'https://image1',
              },
              {
                text: 'Buy',
                type: 'postback',
                value: { dialog: 'products', entities: [{ dim: 'product', value: '1' }] },
              },
            ],
            image_url: 'https://image1.jpg',
            title: 'Card 1',
          },
          {
            buttons: [
              {
                text: 'Details',
                type: 'link',
                value: 'https://image2',
              },
              {
                text: 'Buy',
                type: 'postback',
                value: { dialog: 'products', entities: [{ dim: 'product', value: '2' }] },
              },
            ],
            image_url: 'https://image2.jpg',
            title: 'Card 2',
          },
        ],
      },
    });
  });
});
