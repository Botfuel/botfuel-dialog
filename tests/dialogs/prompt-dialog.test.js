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

const expect = require('expect.js');
const PromptDialog = require('../../src/dialogs/prompt-dialog');
const MemoryBrain = require('../../src/brains/memory-brain');
const TestAdapter = require('../../src/adapters/test-adapter');
const { BotTextMessage } = require('../../src/messages');

const TEST_USER = '1';
const TEST_BOT = process.env.BOT_ID;

// require('../../src/logger_manager').configure({ logger: 'botfuel'});

describe('PromptDialog', function () {
  describe('Simple entities', () => {
    const brain = new MemoryBrain(TEST_BOT);
    const prompt = new PromptDialog({ path: __dirname, locale: 'en' }, brain, {
      namespace: 'testdialog',
      entities: new Map([
        ['myDim1', {
          dim: 'dim1',
        }],
        ['myDim2', {
          dim: 'dim2',
        }],
      ]),
    });

    beforeEach(async function () {
      await brain.clean();
      await brain.initUserIfNecessary(TEST_USER);
    });

    it('should list both and ask for one when given no entity', async function () {
      const adapter = new TestAdapter({ id: TEST_BOT }, {});
      await prompt.execute(adapter, TEST_USER, []);
      expect(adapter.log).to.eql([
        new BotTextMessage('Entities needed: myDim1, myDim2').toJson(TEST_BOT, TEST_USER),
        new BotTextMessage('Which myDim1?').toJson(TEST_BOT, TEST_USER),
      ]);
      const user = await brain.getUser(TEST_USER);
      expect(user.conversations.length).to.be(1);
      expect(user.conversations[0].testdialog.dim1).to.be(undefined);
      expect(user.conversations[0].testdialog.dim2).to.be(undefined);
    });

    it('should list both and ask for the second one when given a first entity', async function () {
      const adapter = new TestAdapter({ id: TEST_BOT }, {});
      await prompt.execute(adapter, TEST_USER, [{ name: 'myDim1', dim: 'dim1', body: 'dim1' }]);
      expect(adapter.log).to.eql([
        new BotTextMessage('Entities defined: dim1').toJson(TEST_BOT, TEST_USER),
        new BotTextMessage('Entities needed: myDim2').toJson(TEST_BOT, TEST_USER),
        new BotTextMessage('Which myDim2?').toJson(TEST_BOT, TEST_USER),
      ]);
      const user = await brain.getUser(TEST_USER);
      expect(user.conversations.length).to.be(1);
      expect(user.conversations[0].testdialog.myDim1).to.eql([
        { name: 'myDim1', dim: 'dim1', body: 'dim1' },
      ]);
      expect(user.conversations[0].testdialog.myDim2).to.be(undefined);
    });

    it('should ask none when given both entity', async function () {
      const adapter = new TestAdapter({ id: TEST_BOT }, {});
      await prompt.execute(
        adapter,
        TEST_USER,
        [
          { name: 'myDim1', dim: 'dim1', body: 'dim1' },
          { name: 'myDim2', dim: 'dim2', body: 'dim2' },
        ],
        PromptDialog.STATUS_READY,
      );
      expect(adapter.log).to.eql([
        new BotTextMessage('Entities defined: dim1, dim2').toJson(TEST_BOT, TEST_USER),
      ]);
      const user = await brain.getUser(TEST_USER);
      expect(user.conversations.length).to.be(1);
      expect(user.conversations[0].testdialog.myDim1).to.eql([
        { name: 'myDim1', dim: 'dim1', body: 'dim1' },
      ]);
      expect(user.conversations[0].testdialog.myDim2).to.eql([
        { name: 'myDim2', dim: 'dim2', body: 'dim2' },
      ]);
    });
  });

  describe('List of entities', () => {
    const brain = new MemoryBrain(TEST_BOT);
    const prompt = new PromptDialog({ path: __dirname, locale: 'en' }, brain, {
      namespace: 'testdialog',
      entities: new Map([
        ['cities', {
          dim: 'city',
          isFulfilled: cities => cities.length === 5,
          reducer: (oldCities, newCities) => [...oldCities, ...newCities],
        }],
      ]),
    });

    beforeEach(async function () {
      await brain.clean();
      await brain.initUserIfNecessary(TEST_USER);
    });

    it('should keep prompting for entities if fulfill condition is not met', async function () {
      const adapter = new TestAdapter({ id: TEST_BOT }, {});
      await prompt.execute(
        adapter,
        TEST_USER,
        [
          { name: 'cities', dim: 'city', body: 'Paris' },
          { name: 'cities', dim: 'city', body: 'Paris' },
          { name: 'cities', dim: 'city', body: 'Paris' },
          { name: 'cities', dim: 'city', body: 'Paris' },
        ],
        PromptDialog.STATUS_READY,
      );
      expect(adapter.log).to.eql([
        new BotTextMessage('Entities defined: Paris, Paris, Paris, Paris').toJson(
          TEST_BOT,
          TEST_USER,
        ),
        new BotTextMessage('Entities needed: cities').toJson(TEST_BOT, TEST_USER),
        new BotTextMessage('Which cities?').toJson(TEST_BOT, TEST_USER),
      ]);
      const user = await brain.getUser(TEST_USER);
      expect(user.conversations.length).to.be(1);
      expect(user.conversations[0].testdialog.cities).to.have.length(4);
    });

    it('should be satisfied if the fulfilled condition is met', async function () {
      const adapter = new TestAdapter({ id: TEST_BOT }, {});
      await prompt.execute(
        adapter,
        TEST_USER,
        [
          { name: 'cities', dim: 'city', body: 'Paris' },
          { name: 'cities', dim: 'city', body: 'Paris' },
          { name: 'cities', dim: 'city', body: 'Paris' },
          { name: 'cities', dim: 'city', body: 'Paris' },
          { name: 'cities', dim: 'city', body: 'Paris' },
        ],
        PromptDialog.STATUS_READY,
      );
      expect(adapter.log).to.eql([
        new BotTextMessage('Entities defined: Paris, Paris, Paris, Paris, Paris').toJson(
          TEST_BOT,
          TEST_USER,
        ),
      ]);
      const user = await brain.getUser(TEST_USER);
      expect(user.conversations.length).to.be(1);
      expect(user.conversations[0].testdialog.cities).to.have.length(5);
    });
  });

  describe('Complex fulfillment condition', () => {
    const brain = new MemoryBrain(TEST_BOT);
    const prompt = new PromptDialog({ path: __dirname, locale: 'en' }, brain, {
      namespace: 'testdialog',
      entities: new Map([
        ['departureCity', {
          dim: 'city',
        }],
        ['arrivalCity', {
          dim: 'city',
          isFulfilled: (arrivalCity, { dialogEntities }) => !!dialogEntities.departureCity &&
            arrivalCity && arrivalCity[0].body !== dialogEntities.departureCity[0].body,
        }],
      ]),
    });

    beforeEach(async function () {
      await brain.clean();
      await brain.initUserIfNecessary(TEST_USER);
    });

    it('should keep prompting for an entity if its fulfill condition is not met', async function () {
      const adapter = new TestAdapter({ id: TEST_BOT }, {});
      await prompt.execute(
        adapter,
        TEST_USER,
        [
          { name: 'departureCity', dim: 'city', body: 'Paris' },
          { name: 'arrivalCity', dim: 'city', body: 'Paris' },
        ],
        PromptDialog.STATUS_READY,
      );
      expect(adapter.log).to.eql([
        new BotTextMessage('Entities defined: Paris, Paris').toJson(
          TEST_BOT,
          TEST_USER,
        ),
        new BotTextMessage('Entities needed: arrivalCity').toJson(TEST_BOT, TEST_USER),
        new BotTextMessage('Which arrivalCity?').toJson(TEST_BOT, TEST_USER),
      ]);
      const user = await brain.getUser(TEST_USER);
      expect(user.conversations.length).to.be(1);
    });
  });
});
