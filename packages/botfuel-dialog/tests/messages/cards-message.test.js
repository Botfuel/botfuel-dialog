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

const Card = require('../../src/messages/card');
const CardsMessage = require('../../src/messages/cards-message');
const Link = require('../../src/messages/link');
const Postback = require('../../src/messages/postback');
const MessageError = require('../../src/errors/message-error');

describe('CardsMessage', () => {
  test('should throw an exception when malformed', async () => {
    // eslint-disable-next-line require-jsdoc
    function validateInvalidObject() {
      // eslint-disable-next-line no-new
      new CardsMessage([{}]);
    }
    expect(validateInvalidObject).toThrow(MessageError);
  });

  test('should generate the proper json', async () => {
    const message = new CardsMessage([
      new Card('Card 1', 'https://image1.jpg', [
        new Link('Details', 'https://image1'),
        new Postback('Buy', { name: 'products', data: { messageEntities: [{ dim: 'product', value: '1' }] } }),
      ]),
      new Card('Card 2', 'https://image2.jpg', [
        new Link('Details', 'https://image2'),
        new Postback('Buy', { name: 'products', data: { messageEntities: [{ dim: 'product', value: '2' }] } }),
      ]),
    ]);
    expect(message.toJson('USER')).toEqual({
      type: 'cards',
      sender: 'bot',
      user: 'USER',
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
                value: {
                  name: 'products',
                  data: {
                    messageEntities: [{ dim: 'product', value: '1' }],
                  },
                },
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
                value: { name: 'products', data: { messageEntities: [{ dim: 'product', value: '2' }] } },
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
