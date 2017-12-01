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

const expect = require('expect.js');
const FileCorpus = require('../../src/corpora/file-corpus');

describe('FileCorpus', function () {
  it('should retrieve the correct values', function () {
    const corpus = new FileCorpus(`${__dirname}/test-corpus.en.txt`);
    expect(corpus.getValue('that')).to.not.be(null);
    expect(corpus.getValue('not')).to.be(null);
  });

  it('should not retrieve empty rows', function () {
    const corpus = new FileCorpus(`${__dirname}/test-corpus.en.txt`);
    expect(corpus.matrix.length).to.be(5);
  });
});
