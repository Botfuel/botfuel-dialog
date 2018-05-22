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

const path = require('path');
const Bot = require('../../src/bot');
const Dialog = require('../../src/dialogs/dialog');
const ClassificationResult = require('../../src/nlus/classification-result');
const BotTextMessage = require('../../src/messages/bot-text-message');
const TEST_CONFIG = require('../../src/config').getConfiguration({
  path: __dirname,
  adapter: { name: 'test' },
  brain: { name: 'memory' },
});

const TEST_USER = '1';

const greetingsDialog = { name: 'greetings', entities: [] };
const thanksDialog = { name: 'thanks', entities: [] };
const travelDialog = { name: 'travel', entities: [] };
const travelCancelDialog = { name: 'travel-cancel', entities: [] };
const classificationDisambiguationDialog = { name: 'classification-disambiguation', entities: [] };

describe('DialogManager', () => {
  const bot = new Bot(TEST_CONFIG);
  const { brain, dm } = bot;

  beforeEach(async () => {
    await brain.clean();
    await brain.addUserIfNecessary(TEST_USER);
  });

  test('when given a name, it should return the correct path', () => {
    expect(dm.getPath('test')).toEqual(path.resolve(__dirname, './src/dialogs/test-dialog.js'));
  });

  test('when given an unknown name, it should return null', () => {
    expect(dm.getPath('unknown')).toBe(null);
  });

  test('should not crash when no intent', async () => {
    const botMessages = await dm.executeClassificationResults({ user: TEST_USER }, [], []);
    expect(botMessages).toEqual([new BotTextMessage('Not understood.').toJson(TEST_USER)]);
  });

  test('should keep on the stack a dialog which is waiting', async () => {
    await dm.executeClassificationResults(
      { user: TEST_USER },
      [new ClassificationResult({ name: 'waiting', type: ClassificationResult.TYPE_INTENT })],
      [],
    );
    const dialogs = await dm.brain.getDialogs(TEST_USER);
    expect(dialogs.stack.length).toBe(1);
  });

  test('should not stack the same dialog twice', async () => {
    await dm.executeClassificationResults(
      { user: TEST_USER },
      [new ClassificationResult({ name: 'waiting', type: ClassificationResult.TYPE_INTENT })],
      [],
    );
    await dm.executeClassificationResults(
      { user: TEST_USER },
      [new ClassificationResult({ name: 'waiting', type: ClassificationResult.TYPE_INTENT })],
      [],
    );
    const dialogs = await dm.brain.getDialogs(TEST_USER);
    expect(dialogs.stack.length).toBe(1);
  });

  test('should empty the stack (1)', async () => {
    await dm.executeClassificationResults(
      { user: TEST_USER },
      [new ClassificationResult({ name: 'default', type: ClassificationResult.TYPE_INTENT })],
      [],
    );
    const dialogs = await dm.brain.getDialogs(TEST_USER);
    expect(dialogs.stack.length).toBe(0);
  });

  test('should empty the stack (2)', async () => {
    await dm.executeDialog({ user: TEST_USER }, { name: 'default' });
    const dialogs = await dm.brain.getDialogs(TEST_USER);
    expect(dialogs.stack.length).toBe(0);
  });

  test('should call classification disambiguation dialog when multiple classification results detected', async () => {
    await dm.executeClassificationResults(
      { user: TEST_USER },
      [
        new ClassificationResult({
          name: 'first-intent',
          resolvePrompt: 'first-intent?',
          type: ClassificationResult.TYPE_INTENT,
        }),
        new ClassificationResult({
          name: 'second-intent',
          resolvePrompt: 'second-intent?',
          type: ClassificationResult.TYPE_INTENT,
        }),
      ],
      [],
    );
    const dialogs = await dm.brain.getDialogs(TEST_USER);
    expect(dialogs.stack.length).toBe(0);
    expect(dialogs.previous[0].name).toEqual(classificationDisambiguationDialog.name);
  });

  test('Should not understand when no intent and a dialog currently exists', async () => {
    await dm.executeClassificationResults(
      { user: TEST_USER },
      [new ClassificationResult({ name: 'waiting', type: ClassificationResult.TYPE_INTENT })],
      [],
    );
    const botMessage = await dm.executeClassificationResults({ user: TEST_USER }, [], []);
    expect(botMessage).toEqual([new BotTextMessage('Not understood.').toJson(TEST_USER)]);
  });

  test('should save all messages entities', async () => {
    const greetingsDialogEntities = {
      name: 'greetings-entitities',
      data: {
        messageEntities: [],
      },
    };
    const dialogs = {
      stack: [greetingsDialogEntities],
      previous: [],
    };
    const entities = [{ dim: 'paris' }];
    await dm.updateWithClassificationResults(
      { user: TEST_USER },
      dialogs,
      [],
      entities,
    );
    expect(dialogs.stack[dialogs.stack.length - 1].data.messageEntities).toEqual(entities);
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
