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
const Dialog = require('../../src/dialogs/dialog');
const DialogError = require('../../src/errors/dialog-error');
const TEST_CONFIG = require('../../src/config').getConfiguration({
  brain: {
    name: 'memory',
  },
  custom: {
    foo: 'bar',
  },
});

describe('Dialog', () => {
  const bot = new Bot(TEST_CONFIG);
  const dialog = new Dialog(bot, {
    namespace: 'testdialog',
    entities: {},
  });

  test('should throw a missing implementation error', async () => {
    expect.assertions(1);
    try {
      await dialog.execute();
    } catch (e) {
      expect(e.message).toEqual('Not implemented!');
    }
  });

  test('should throw a dialog error', () => {
    expect(() => dialog.triggerNext(null)).toThrow(DialogError);
  });

  test('should prepare trigger next dialog action', () => {
    expect(dialog.triggerNext('greetings')).toEqual({
      newDialog: {
        name: 'greetings',
        data: {},
      },
      name: Dialog.ACTION_NEXT,
    });
  });

  test('should prepare cancel dialog action', () => {
    expect(dialog.cancelPrevious()).toEqual({
      name: Dialog.ACTION_CANCEL,
    });
  });

  test('should prepare cancel dialog action with a new dialog', () => {
    expect(dialog.cancelPrevious('greetings')).toEqual({
      newDialog: {
        name: 'greetings',
        data: {},
      },
      name: Dialog.ACTION_CANCEL,
    });
  });

  test('should prepare start new conversation action', () => {
    expect(dialog.startNewConversation()).toEqual({
      name: Dialog.ACTION_NEW_CONVERSATION,
    });
  });

  test('should prepare start new conversation action with a new dialog', () => {
    expect(dialog.startNewConversation('greetings')).toEqual({
      newDialog: {
        name: 'greetings',
        data: {},
      },
      name: Dialog.ACTION_NEW_CONVERSATION,
    });
  });

  test('should prepare complete action', () => {
    expect(dialog.complete()).toEqual({
      name: Dialog.ACTION_COMPLETE,
    });
  });

  test('should prepare wait dialog', () => {
    expect(dialog.wait()).toEqual({
      name: Dialog.ACTION_WAIT,
    });
  });

  // test merge extraData to data
  describe('merge extraData to data', () => {
    test('handle edges cases (null) correctly', () => {
      expect(dialog.mergeData(null, null)).toEqual(null);
      expect(dialog.mergeData(null, {})).toEqual({});
      expect(dialog.mergeData({}, null)).toEqual({});
    });

    test('when extraData is an object', () => {
      expect(dialog.mergeData({ greeted: true }, {})).toEqual({ greeted: true });
    });

    test('throw error when extraData have keys in data', () => {
      expect(() => dialog.mergeData({ greeted: true }, { greeted: false })).toThrowError();
    });

    test('when extraData is a value or array', () => {
      expect(dialog.mergeData(42, {})).toEqual({ extraData: 42 });
      expect(dialog.mergeData(undefined, {})).toEqual({ extraData: undefined });
      expect(dialog.mergeData(['a', 'b'], {})).toEqual({ extraData: ['a', 'b'] });
    });
  });

  // config access
  test('should have access to config custom property', () => {
    expect(dialog.config).toEqual({ foo: 'bar' });
  });
});
