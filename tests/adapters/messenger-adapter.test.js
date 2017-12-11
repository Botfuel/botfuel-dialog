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

/* eslint-disable prefer-arrow-callback */
/* eslint-disable quotes */

const MessengerAdapter = require('../../src/adapters/messenger-adapter');
const { Card, CardsMessage, Link, Postback } = require('../../src/messages');

describe('MessengerAdapter', () => {
  test('should generate the proper json', async () => {
    const message = new CardsMessage([
      new Card('Card 1', 'https://image1.jpg', [
        new Link('Details', 'https://image1'),
        new Postback('Buy', 'products', [{ dim: 'product', value: '1' }]),
      ]),
      new Card('Card 2', 'https://image2.jpg', [
        new Link('Details', 'https://image2'),
        new Postback('Buy', 'products', [{ dim: 'product', value: '2' }]),
      ]),
    ]);
    expect(new MessengerAdapter({}).adapt(message.toJson('BOT', 'USER'))).toEqual({
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
                  payload: '{"dialog":"products","entities":[{"dim":"product","value":"1"}]}',
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
                  payload: '{"dialog":"products","entities":[{"dim":"product","value":"2"}]}',
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
