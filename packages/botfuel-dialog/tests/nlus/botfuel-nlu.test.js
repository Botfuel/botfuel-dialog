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
const BotfuelNlu = require('../../src/nlus/botfuel-nlu');
const SdkError = require('../../src/errors/sdk-error');

const TEST_USER_ID = 'test';

describe('Botfuel Nlu', () => {
  describe('check credentials', () => {
    const sandbox = sinon.sandbox.create();

    afterEach(() => {
      sandbox.restore();
    });

    test('to throw error if missing BOTFUEL_APP_TOKEN', () => {
      sandbox.stub(process, 'env').value({ BOTFUEL_APP_ID: '', BOTFUEL_APP_TOKEN: '' });
      expect(() => new BotfuelNlu()).toThrowError(SdkError);
    });

    test('to throw error if missing BOTFUEL_APP_ID', () => {
      sandbox.stub(process, 'env').value({ BOTFUEL_APP_KEY: '', BOTFUEL_APP_TOKEN: '' });
      expect(() => new BotfuelNlu()).toThrowError(SdkError);
    });

    test('to throw error if missing BOTFUEL_APP_KEY', () => {
      sandbox.stub(process, 'env').value({ BOTFUEL_APP_ID: '', BOTFUEL_APP_KEY: '' });
      expect(() => new BotfuelNlu()).toThrowError(SdkError);
    });
  });

  // IMPORTANT: for REPLAY record, use what ever test app that has greetings intent and qna
  describe('compute', () => {
    test('to correctly detect intents ', async () => {
      const nlu = new BotfuelNlu({ nlu: {} });
      // fake extractor
      nlu.extractor = new CompositeExtractor({
        extractors: [],
      });
      const sentence = 'hello';
      const { classificationResults } = await nlu.compute(sentence, {
        userMessage: { user: TEST_USER_ID },
      });
      expect(classificationResults.length).toEqual(1);
      expect(classificationResults[0].type).toEqual(ClassificationResult.TYPE_INTENT);
    });

    test('to correctly detect qnas', async () => {
      const nlu = new BotfuelNlu({ nlu: {} });
      // fake extractor
      nlu.extractor = new CompositeExtractor({
        extractors: [],
      });
      const sentence = 'delivery';
      const { classificationResults } = await nlu.compute(sentence, {
        userMessage: { user: TEST_USER_ID },
      });

      expect(classificationResults.length).toEqual(1);
      expect(classificationResults[0].type).toEqual(ClassificationResult.TYPE_QNA);
    });
  });

  describe('spellchecking', () => {
    test('should return the original sentence when no spellchecking key', async () => {
      const nlu = new BotfuelNlu({ nlu: {} });
      const sentence = 'helllo';
      const result = await nlu.spellcheck(sentence);
      expect(result).toEqual('helllo');
    });

    test('should correct the spelling in a sentence', async () => {
      const nlu = new BotfuelNlu({
        nlu: {
          spellchecking: true,
        },
      });
      const sentence = 'helllo';
      const result = await nlu.spellcheck(sentence);
      expect(result).toEqual('hello');
    });
  });
});
