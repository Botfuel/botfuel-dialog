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

/* eslint-disable prefer-arrow-callback */

const path = require('path');
const expect = require('expect.js');
const fs = require('fs-extra');
const Classifer = require('../../src/classifier');

const globalTestDirPath = path.join(process.cwd(), '_tmp_tests');
const testDirPath = path.join(globalTestDirPath, '_tmp_test_classifier');
const modelPath = path.join(testDirPath, 'model.json');
const makeIntentPath = name => path.join(testDirPath, name);
const classifier = new Classifer({ path: __dirname, locale: 'en' });

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Classifier', function () {
  before(function () {
    this.globalTestDir = fs.ensureDirSync(globalTestDirPath);
    this.testDir = fs.ensureDirSync(testDirPath);
  });

  describe('isModelUpToDate', async function () {
    before(async () => {
      await Promise.all([
        fs.ensureFileSync(makeIntentPath('1.intent')),
        fs.ensureFileSync(makeIntentPath('2.intent')),
        fs.ensureFileSync(makeIntentPath('3.intent')),
      ]);

      await timeout(1000);

      await fs.ensureFileSync(modelPath);
    });

    it('should return true if model is fresher than intents', async function () {
      const isModelFresh = await classifier.isModelUpToDate(modelPath, testDirPath);
      expect(isModelFresh).to.be(true);
    });

    it('should return false if model is fresher than intents', async function () {
      await fs.ensureFileSync(makeIntentPath('4.intent'));
      const isModelFresh = await classifier.isModelUpToDate(modelPath, testDirPath);
      expect(isModelFresh).to.be(false);
    });
  });

  after(function () {
    fs.removeSync(path.join(process.cwd(), '_tmp_tests'));
  });
});
