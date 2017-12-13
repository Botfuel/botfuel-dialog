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
const DialogManager = require('../../src/dialog-manager');
const MemoryBrain = require('../../src/brains/memory-brain');
const TestAdapter = require('../../src/adapters/test-adapter');
const { BotTextMessage } = require('../../src/messages');

const TEST_USER = '1';
const TEST_BOT = process.env.BOT_ID;

require('../../src/logger-manager').configure({ logger: 'botfuel' });

describe('DialogManager', function () {
  const brain = new MemoryBrain(TEST_BOT);
  const dm = new DialogManager(brain, { path: __dirname, locale: 'en' });

  beforeEach(async function () {
    await brain.clean();
    await brain.initUserIfNecessary(TEST_USER);
  });

  it('when given a name, it should return the correct path', function () {
    expect(dm.getDialogPath('test')).to.eql(`${__dirname}/src/dialogs/test-dialog`);
  });

  it('when given an unknown name, it should return null', function () {
    expect(dm.getDialogPath('unknown')).to.be(null);
  });

  it('should not crash when no intent', async function () {
    const adapter = new TestAdapter({ id: TEST_BOT }, {});
    await dm.executeIntents(adapter, TEST_USER, [], []);
    expect(adapter.log).to.eql([new BotTextMessage('Not understood.').toJson(TEST_BOT, TEST_USER)]);
  });

  it('should keep on the stack a dialog which is waiting', async function () {
    await dm.executeIntents(null, TEST_USER, [{ name: 'waiting', value: 1.0 }], []);
    const user = await dm.brain.getUser(TEST_USER);
    expect(user.dialogs.stack.length).to.be(1);
  });

  it('should not stack the same dialog twice', async function () {
    await dm.executeIntents(null, TEST_USER, [{ name: 'waiting', value: 1.0 }], []);
    await dm.executeIntents(null, TEST_USER, [{ name: 'waiting', value: 1.0 }], []);
    const user = await dm.brain.getUser(TEST_USER);
    expect(user.dialogs.stack.length).to.be(1);
  });

  it('should empty the stack (1)', async function () {
    const adapter = new TestAdapter({ id: TEST_BOT }, {});
    await dm.executeIntents(adapter, TEST_USER, [{ name: 'default', value: 1.0 }], []);
    const user = await dm.brain.getUser(TEST_USER);
    expect(user.dialogs.stack.length).to.be(0);
  });

  it('should empty the stack (2)', async function () {
    const adapter = new TestAdapter({ id: TEST_BOT }, {});
    await dm.executeDialogs(adapter, TEST_USER, [{ name: 'default' }]);
    const user = await dm.brain.getUser(TEST_USER);
    expect(user.dialogs.stack.length).to.be(0);
  });
});
