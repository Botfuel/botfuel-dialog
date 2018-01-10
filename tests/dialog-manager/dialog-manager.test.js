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

const DialogManager = require('../../src/dialog-manager');
const MemoryBrain = require('../../src/brains/memory-brain');
const TestAdapter = require('../../src/adapters/test-adapter');
const BotTextMessage = require('../../src/messages/bot-text-message');

const TEST_USER = '1';
const TEST_BOT = process.env.BOTFUEL_APP_TOKEN;

describe('DialogManager', () => {
  const brain = new MemoryBrain(TEST_BOT);
  const dm = new DialogManager(brain, { path: __dirname, locale: 'en' });

  beforeEach(async () => {
    await brain.clean();
    await brain.initUserIfNecessary(TEST_USER);
  });

  test('when given a name, it should return the correct path', () => {
    expect(dm.getPath('test')).toEqual(`${__dirname}/src/dialogs/test-dialog.js`);
  });

  test('when given an unknown name, it should return null', () => {
    expect(dm.getPath('unknown')).toBe(null);
  });

  test('should not crash when no intent', async () => {
    const adapter = new TestAdapter({ id: TEST_BOT }, {});
    await dm.executeIntents(adapter, TEST_USER, [], []);
    expect(adapter.log).toEqual([
      new BotTextMessage('Not understood.').toJson(TEST_BOT, TEST_USER),
    ]);
  });

  test('should keep on the stack a dialog which is waiting', async () => {
    await dm.executeIntents(null, TEST_USER, [{ name: 'waiting', value: 1.0 }], []);
    const dialogs = await dm.brain.getDialogs(TEST_USER);
    expect(dialogs.stack.length).toBe(1);
  });

  test('should not stack the same dialog twice', async () => {
    await dm.executeIntents(null, TEST_USER, [{ name: 'waiting', value: 1.0 }], []);
    await dm.executeIntents(null, TEST_USER, [{ name: 'waiting', value: 1.0 }], []);
    const dialogs = await dm.brain.getDialogs(TEST_USER);
    expect(dialogs.stack.length).toBe(1);
  });

  test('should empty the stack (1)', async () => {
    const adapter = new TestAdapter({ id: TEST_BOT }, {});
    await dm.executeIntents(adapter, TEST_USER, [{ name: 'default', value: 1.0 }], []);
    const dialogs = await dm.brain.getDialogs(TEST_USER);
    expect(dialogs.stack.length).toBe(0);
  });

  test('should empty the stack (2)', async () => {
    const adapter = new TestAdapter({ id: TEST_BOT }, {});
    await dm.executeDialogs(adapter, TEST_USER, [{ name: 'default' }]);
    const dialogs = await dm.brain.getDialogs(TEST_USER);
    expect(dialogs.stack.length).toBe(0);
  });
});
