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

const ClassificationResult = require('../../src/nlus/classification-result');
const ClassificationDisambiguationDialog = require('../../src/dialogs/classification-disambiguation-dialog');
const MemoryBrain = require('../../src/brains/memory-brain');
const TestAdapter = require('../../src/adapters/test-adapter');
const TEST_CONFIG = require('../../src/config').getConfiguration({});

describe('ClassificationDisambiguationDialog', () => {
  const brain = new MemoryBrain(TEST_CONFIG);

  test('should complete', async () => {
    const dialog = new ClassificationDisambiguationDialog(TEST_CONFIG, brain);
    const adapter = new TestAdapter({});
    const classificationResults = [
      new ClassificationResult({
        type: ClassificationResult.TYPE_INTENT,
        name: 'trip',
        resolvePrompt: 'You want trip information?',
      }),
      new ClassificationResult({
        type: ClassificationResult.TYPE_QNA,
        name: 'qnas',
        resolvePrompt: 'You want delivery information?',
        answers: [[{ value: 'Here is your delivery information' }]],
      }),
    ];

    expect(
      await dialog.execute(
        adapter,
        { user: 'TEST_USER' },
        { classificationResults, messageEntities: [] },
      ),
    ).toEqual({
      name: ClassificationDisambiguationDialog.ACTION_COMPLETE,
    });
  });
});
