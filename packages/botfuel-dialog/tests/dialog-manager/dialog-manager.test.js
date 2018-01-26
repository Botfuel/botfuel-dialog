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

// require('../../src/logger-manager').configure({ logger: 'botfuel'});

const DialogManager = require('../../src/dialog-manager');
const Dialog = require('../../src/dialogs/dialog');
const MemoryBrain = require('../../src/brains/memory-brain');
const TestAdapter = require('../../src/adapters/test-adapter');
const BotTextMessage = require('../../src/messages/bot-text-message');

const TEST_USER = '1';

const greetingsDialog = { name: 'greetings', entities: [] };
const thanksDialog = { name: 'thanks', entities: [] };
const travelDialog = { name: 'travel', entities: [] };
const travelCancelDialog = { name: 'travel-cancel', entities: [] };

describe('DialogManager', () => {
  const brain = new MemoryBrain({ conversationDuration: 86400000 });
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
    const adapter = new TestAdapter({});
    await dm.executeIntents(adapter, { user: TEST_USER }, [], []);
    expect(adapter.log).toEqual([new BotTextMessage('Not understood.').toJson(TEST_USER)]);
  });

  test('should keep on the stack a dialog which is waiting', async () => {
    await dm.executeIntents(null, { user: TEST_USER }, ['waiting'], []);
    const dialogs = await dm.brain.getDialogs(TEST_USER);
    expect(dialogs.stack.length).toBe(1);
  });

  test('should not stack the same dialog twice', async () => {
    await dm.executeIntents(null, { user: TEST_USER }, ['waiting'], []);
    await dm.executeIntents(null, { user: TEST_USER }, ['waiting'], []);
    const dialogs = await dm.brain.getDialogs(TEST_USER);
    expect(dialogs.stack.length).toBe(1);
  });

  test('should empty the stack (1)', async () => {
    const adapter = new TestAdapter({});
    await dm.executeIntents(adapter, { user: TEST_USER }, ['default'], []);
    const dialogs = await dm.brain.getDialogs(TEST_USER);
    expect(dialogs.stack.length).toBe(0);
  });

  test('should empty the stack (2)', async () => {
    const adapter = new TestAdapter({});
    await dm.executeDialogs(adapter, { user: TEST_USER }, [{ name: 'default' }]);
    const dialogs = await dm.brain.getDialogs(TEST_USER);
    expect(dialogs.stack.length).toBe(0);
  });

  describe('DialogManager.applyAction', () => {
    describe('Action cancel', () => {
      let dialogs;

      beforeEach(() => {
        dialogs = {
          stack: [travelDialog, travelCancelDialog],
          previous: [],
        };
      });

      test('should cancel the two last dialogs', async () => {
        const action = { name: Dialog.ACTION_CANCEL };
        dialogs = dm.applyAction(dialogs, action);
        expect(dialogs.stack.length).toBe(0);
        expect(dialogs.previous.length).toBe(1);
      });

      test('should cancel the two last dialogs and add the newDialog', async () => {
        const action = { name: Dialog.ACTION_CANCEL, newDialog: thanksDialog };
        dialogs = dm.applyAction(dialogs, action);
        expect(dialogs.stack.length).toBe(1);
        expect(dialogs.stack[0].name).toBe(thanksDialog.name);
        expect(dialogs.previous.length).toBe(1);
      });
    });

    describe('Action complete', () => {
      let dialogs;

      beforeEach(() => {
        dialogs = {
          stack: [thanksDialog, greetingsDialog],
          previous: [],
        };
      });

      test('should complete the current dialog', async () => {
        const action = { name: Dialog.ACTION_COMPLETE };
        dialogs = dm.applyAction(dialogs, action);
        expect(dialogs.stack.length).toBe(1);
        expect(dialogs.stack[0].name).toBe(thanksDialog.name);
        expect(dialogs.previous.length).toBe(1);
        expect(dialogs.previous[0].name).toBe(greetingsDialog.name);
      });
    });

    describe('Action next', () => {
      let dialogs;

      beforeAll(() => {
        dialogs = {
          stack: [greetingsDialog],
          previous: [],
        };
        const action = { name: Dialog.ACTION_NEXT, newDialog: travelDialog };
        dialogs = dm.applyAction(dialogs, action);
      });

      test('should complete the current dialog', async () => {
        expect(dialogs.previous.length).toBe(1);
        expect(dialogs.previous[0].name).toBe(greetingsDialog.name);
      });

      test('should add the next dialog to the stack', async () => {
        expect(dialogs.stack.length).toBe(1);
        expect(dialogs.stack[0].name).toBe(travelDialog.name);
      });
    });

    describe('Action new conversation', () => {
      let dialogs;

      beforeEach(() => {
        dialogs = {
          stack: [greetingsDialog, travelDialog],
          previous: [thanksDialog],
        };
      });

      test('should start a new empty conversation', async () => {
        const action = { name: Dialog.ACTION_NEW_CONVERSATION };
        dialogs = dm.applyAction(dialogs, action);
        expect(dialogs.stack.length).toBe(0);
        expect(dialogs.previous.length).toBe(0);
      });

      test('should start a new conversation with a dialog', async () => {
        const action = {
          name: Dialog.ACTION_NEW_CONVERSATION,
          newDialog: travelDialog,
        };
        dialogs = dm.applyAction(dialogs, action);
        expect(dialogs.stack.length).toBe(1);
        expect(dialogs.stack[0].name).toBe(travelDialog.name);
        expect(dialogs.previous.length).toBe(0);
      });
    });
  });
});
