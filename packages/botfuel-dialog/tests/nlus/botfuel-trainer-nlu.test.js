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
const sinon = require('sinon');
const CompositeExtractor = require('../../src/extractors/composite-extractor');
const ClassificationResult = require('../../src/nlus/classification-result');
const BotfuelTrainerNlu = require('../../src/nlus/botfuel-trainer-nlu');
const SdkError = require('../../src/errors/sdk-error');

describe('Botfuel Trainer Nlu', () => {
  const sandbox = sinon.sandbox.create();

  afterEach(() => {
    sandbox.restore();
  });

  test('to throw error if missing BOTFUEL_APP_TOKEN', () => {
    sandbox.stub(process, 'env').value({ BOTFUEL_APP_TOKEN: undefined });
    expect(() => new BotfuelTrainerNlu()).toThrowError(SdkError);
  });

  describe('compute', () => {
    test('to correctly detect intents ', async () => {
      // use app token = 1409617651128 to record trainer api response
      sandbox.stub(process, 'env').value({ BOTFUEL_APP_TOKEN: '1409617651128' });
      const nlu = new BotfuelTrainerNlu();
      // fake extractor
      nlu.extractor = new CompositeExtractor({
        extractors: [],
      });
      const sentence = 'hello';
      const { classificationResults } = await nlu.compute(sentence);
      expect(classificationResults.length).toEqual(1);
      expect(classificationResults[0].type).toEqual(ClassificationResult.TYPE_INTENT);
    });

    test('to correctly detect qnas', async () => {
      // use app token = 1409617651128 to record trainer api response
      sandbox.stub(process, 'env').value({ BOTFUEL_APP_TOKEN: '1409617651128' });
      const nlu = new BotfuelTrainerNlu();
      // fake extractor
      nlu.extractor = new CompositeExtractor({
        extractors: [],
      });
      const sentence = 'delivery';
      const { classificationResults } = await nlu.compute(sentence);
      expect(classificationResults.length).toEqual(1);
      expect(classificationResults[0].type).toEqual(ClassificationResult.TYPE_QNA);
    });
  });
});
