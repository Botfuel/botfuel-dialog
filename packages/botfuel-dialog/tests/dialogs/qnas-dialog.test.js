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

const QnasDialog = require('../../src/dialogs/qnas-dialog');
const MemoryBrain = require('../../src/brains/memory-brain');
const ShellAdapter = require('../../src/adapters/shell-adapter');
const TEST_CONFIG = require('../../src/config').getConfiguration({});

describe('QnasDialog', () => {
  const brain = new MemoryBrain(TEST_CONFIG);
  const dialog = new QnasDialog(TEST_CONFIG, brain);
  const adapter = new ShellAdapter({});
  const oneQna = [{ dim: 'qnas', value: [{ questions: ['question'], answer: 'answer' }] }];
  const manyQnas = [
    {
      dim: 'qnas',
      value: [
        { questions: ['question'], answer: 'answer' },
        { questions: ['question 2'], answer: 'answer 2' },
      ],
    },
  ];

  test('should return the complete action', async () => {
    const action = await dialog.execute(adapter, {}, oneQna);
    expect(action).toEqual({
      name: QnasDialog.ACTION_COMPLETE,
    });
  });

  test('should return the wait action', async () => {
    const action = await dialog.execute(adapter, {}, manyQnas);
    expect(action).toEqual({
      name: QnasDialog.ACTION_WAIT,
    });
  });
});
