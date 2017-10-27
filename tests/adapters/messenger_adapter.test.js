/* eslint-disable prefer-arrow-callback */
/* eslint-disable quotes */

const expect = require('expect.js');

const MessengerAdapter = require('../../src/adapters/messenger_adapter');
const { Card, CardsMessage, Link, Postback } = require('../../src/messages');

describe('MessengerAdapter', function () {
  it('should generate the proper json', async function () {
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
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              image_url: 'https://image1.jpg',
              title: 'Card 1',
              buttons: [
                {
                  title: 'Details',
                  type: 'web_url',
                  url: 'https://image1',
                },
                {
                  payload: "{\"dialog\":\"products\",\"entities\":[{\"dim\":\"product\",\"value\":\"1\"}]}",
                  title: 'Buy',
                  type: 'postback',
                },
              ],
            },
            {
              image_url: 'https://image2.jpg',
              title: 'Card 2',
              buttons: [
                {
                  title: 'Details',
                  type: 'web_url',
                  url: 'https://image2',
                },
                {
                  payload: "{\"dialog\":\"products\",\"entities\":[{\"dim\":\"product\",\"value\":\"2\"}]}",
                  title: 'Buy',
                  type: 'postback',
                },
              ],
            },
          ],
        },
      },
    });
  });
});
