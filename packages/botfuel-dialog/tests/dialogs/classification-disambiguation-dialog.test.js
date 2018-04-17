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
const ClassificationResult = require('../../src/nlus/classification-result');
const ClassificationDisambiguationDialog = require('../../src/dialogs/classification-disambiguation-dialog');
const TEST_CONFIG = require('../../src/config').getConfiguration({
  adapter: {
    name: 'test',
  },
  brain: {
    name: 'memory',
  },
});

describe('ClassificationDisambiguationDialog', () => {
  const bot = new Bot(TEST_CONFIG);

  test('should complete', async () => {
    const dialog = new ClassificationDisambiguationDialog(bot);
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

    const { action } = await dialog.execute(
      { user: 'TEST_USER' },
      { classificationResults, messageEntities: [] },
    );
    expect(action).toEqual({
      name: ClassificationDisambiguationDialog.ACTION_COMPLETE,
    });
  });
});
