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

const path = require('path');
const fs = require('fs-extra');
const Classifer = require('../../src/classifier');

const globalTestDirPath = path.join(process.cwd(), '_tmp_tests');
const testDirPath = path.join(globalTestDirPath, '_tmp_test_classifier');
const modelPath = path.join(testDirPath, 'model.json');
const intentsDirPath = path.join(testDirPath, 'intents');
const makeIntentPath = name => path.join(intentsDirPath, name);
const classifier = new Classifer({ path: __dirname, locale: 'en' });

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Classifier', () => {
  beforeAll(function () {
    this.globalTestDir = fs.ensureDirSync(globalTestDirPath);
    this.testDir = fs.ensureDirSync(testDirPath);
  });

  describe('isModelUpToDate', async () => {
    beforeAll(async () => {
      await Promise.all([
        fs.ensureFile(makeIntentPath('1.intent')),
        fs.ensureFile(makeIntentPath('2.intent')),
        fs.ensureFile(makeIntentPath('3.intent')),
      ]);

      await timeout(1000);

      await fs.ensureFile(modelPath);
    });

    test('should return true if model is fresher than intents', async () => {
      const isModelFresh = await classifier.isModelUpToDate(modelPath, intentsDirPath);
      expect(isModelFresh).toBe(true);
    });

    test('should return false if model is fresher than intents', async () => {
      await fs.ensureFileSync(makeIntentPath('4.intent'));
      const isModelFresh = await classifier.isModelUpToDate(modelPath, intentsDirPath);
      expect(isModelFresh).toBe(false);
    });
  });

  describe('intentsAndModelExist', async () => {
    test('should return true if both model and intents dir exist', async () => {
      await fs.ensureFile(modelPath);
      await fs.ensureDir(intentsDirPath);
      const intentsAndModelExist = await classifier.intentsAndModelExist(modelPath, intentsDirPath);
      expect(intentsAndModelExist).toBe(true);
    });

    test('should return false if only model file does not exist', async () => {
      await fs.remove(modelPath);
      await fs.ensureDir(intentsDirPath);
      const intentsAndModelExist = await classifier.intentsAndModelExist(modelPath, intentsDirPath);
      expect(intentsAndModelExist).toBe(false);
    });

    test('should return false if only intents dir does not exist', async () => {
      await fs.ensureFile(modelPath);
      await fs.remove(intentsDirPath);
      const intentsAndModelExist = await classifier.intentsAndModelExist(modelPath, intentsDirPath);
      expect(intentsAndModelExist).toBe(false);
    });

    test('should return false if both model and intents dir do not exist', async () => {
      await fs.remove(modelPath);
      await fs.remove(intentsDirPath);
      const intentsAndModelExist = await classifier.intentsAndModelExist(modelPath, intentsDirPath);
      expect(intentsAndModelExist).toBe(false);
    });
  });

  afterAll(() => {
    fs.removeSync(path.join(process.cwd(), '_tmp_tests'));
  });
});
