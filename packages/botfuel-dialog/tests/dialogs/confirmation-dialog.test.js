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
const ConfirmationDialog = require('../../src/dialogs/confirmation-dialog');
const UserTextMessage = require('../../src/messages/user-text-message');
const TEST_CONFIG = require('../../src/config').getConfiguration({
  brain: {
    name: 'memory',
  },
});

const USER_ID = 'USER';

describe('ConfirmationDialog', () => {
  const bot = new Bot(TEST_CONFIG);
  const { brain } = bot;

  beforeEach(async () => {
    await brain.addUser(USER_ID);
  });

  afterEach(async () => {
    await brain.clean();
  });

  test('should return the complete action', async () => {
    const dialog = new ConfirmationDialog(bot, {
      namespace: 'confirmation-dialog',
    });
    const action = await dialog.dialogWillComplete(new UserTextMessage('message').toJson(USER_ID), {
      matchedEntities: { answer: { values: [{ dim: 'system:boolean', value: true }] } },
    });
    expect(action).toEqual({
      name: ConfirmationDialog.ACTION_COMPLETE,
    });
  });

  test('should return the cancel action', async () => {
    const dialog = new ConfirmationDialog(bot, {
      namespace: 'confirmation-dialog',
    });
    const action = await dialog.dialogWillComplete(new UserTextMessage('message').toJson(USER_ID), {
      matchedEntities: { answer: { values: [{ dim: 'system:boolean', value: false }] } },
    });
    expect(action).toEqual({
      name: ConfirmationDialog.ACTION_CANCEL,
    });
  });
});
