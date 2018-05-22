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

const Bot = require('../../src/bot');
const MessengerAdapter = require('../../src/adapters/messenger-adapter');
const BotTextMessage = require('../../src/messages/bot-text-message');
const Card = require('../../src/messages/card');
const CardsMessage = require('../../src/messages/cards-message');
const Link = require('../../src/messages/link');
const Postback = require('../../src/messages/postback');
const Config = require('../../src/config');
const sinon = require('sinon');
const rp = require('request-promise-native');
const uuidv4 = require('uuid/v4');

const TEST_CONFIG = Config.getConfiguration({
  adapter: { name: 'messenger' },
  brain: { name: 'memory' },
});
const TEST_USER = 'TEST_USER';

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
    expect(new MessengerAdapter({}).adapt(message.toJson('USER'))).toEqual({
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

  test('should add properties to the json message', async () => {
    const message = new BotTextMessage('message');
    const extended = new MessengerAdapter({}).extendMessage(message.toJson('USER'));
    expect(Object.keys(extended).sort()).toEqual(['id', 'payload', 'sender', 'timestamp', 'type', 'user']);
    expect(extended).toHaveProperty('user', 'USER');
    expect(extended).toHaveProperty('payload.value', 'message');
  });
});

describe('MessengerAdapter request handling', () => {
  test('should handle a request from messenger', async () => {
    // Data definitions

    const profile = {
      firstName: 'Sample',
      lastName: 'User',
    };
    const userMessageUuid = uuidv4();
    const botMessageUuid = uuidv4();
    const handlingTimestamp = Date.now();
    const responseTimestamp = Date.now() + 500;
    const userMessageText = 'hello ca va?';
    const testRequest = {
      body: {
        object: 'page',
        entry: [
          {
            id: '<PAGE_ID>',
            time: Date.now() - 150,
            messaging: [
              {
                sender: {
                  id: TEST_USER,
                },
                recipient: {
                  id: '<RECIPIENT_ID>',
                },
                timestamp: Date.now() - 500,
                message: {
                  mid: 'mid.$cAAYyhkMB6E1plZcx11jZFHo5moFm',
                  seq: 38631,
                  text: userMessageText,
                },
              },
            ],
          },
        ],
      },
    };
    const expectedUserMessage = {
      id: userMessageUuid,
      payload: {
        value: userMessageText,
      },
      sender: 'user',
      timestamp: handlingTimestamp,
      type: 'text',
      user: TEST_USER,
    };
    const botMessageText = 'Hi I am a bot!';
    const botMessage = [
      {
        type: 'text',
        sender: 'bot',
        user: TEST_USER,
        payload: {
          value: botMessageText,
        },
        id: botMessageUuid,
        timestamp: responseTimestamp,
      },
    ];
    const expectedBotResponse = {
      body: {
        message: {
          text: 'Hi I am a bot!',
        },
        messaging_type: 'RESPONSE',
        recipient: {
          id: 'TEST_USER',
        },
      },
      json: true,
      qs: {
        access_token: undefined,
      },
      uri: 'https://graph.facebook.com/v2.6/me/messages',
    };

    // Creating the adapter and mocking the adapter's friends

    const bot = new Bot(TEST_CONFIG);
    const { brain, adapter } = bot;
    await brain.addUser(TEST_USER);
    await bot.brain.userSet(TEST_USER, 'profile', profile);

    sinon.stub(adapter, 'getMessageUUID')
      .onFirstCall()
      .returns(userMessageUuid)
      .onSecondCall()
      .returns(botMessageUuid);
    sinon.stub(adapter, 'getMessageTimestamp')
      .onFirstCall()
      .returns(handlingTimestamp)
      .onSecondCall()
      .returns(responseTimestamp);

    const handleMessageStub = sinon.stub(bot, 'handleMessage');
    handleMessageStub.callsFake(async () => botMessage);

    const responseDouble = { sendStatus: () => null };
    const responseMock = sinon.mock(responseDouble);
    responseMock.expects('sendStatus').once().withExactArgs(200);

    const requestStub = sinon.stub(rp, 'post').callsFake(() => ({ statusCode: 200 }));

    // Execute

    await adapter.handleRequest(testRequest, responseDouble);

    // Assert

    responseMock.verify();

    expect(handleMessageStub.callCount).toBe(1);
    expect(handleMessageStub.lastCall.args).toEqual([expectedUserMessage]);

    expect(requestStub.callCount).toBe(1);
    expect(requestStub.firstCall.args).toEqual([expectedBotResponse]);
  });
});
