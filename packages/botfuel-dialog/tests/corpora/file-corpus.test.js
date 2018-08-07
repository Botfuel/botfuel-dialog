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
const FileCorpus = require('../../src/corpora/file-corpus');
const ExtractorError = require('../../src/errors/extractor-error');

describe('FileCorpus', () => {
  test('should retrieve the correct values', () => {
    const corpus = new FileCorpus(path.resolve(__dirname, './test-corpus.en.txt'));
    expect(corpus.getValue('that')).not.toBe(null);
    expect(corpus.getValue('not')).toBe(null);
  });

  test('should not retrieve empty rows', () => {
    const corpus = new FileCorpus(path.resolve(__dirname, './test-corpus.en.txt'));
    expect(corpus.matrix.length).toBe(5);
  });

  test('should not throw when the corpus file name contains a trailing comma', () => {
    const corpus = new FileCorpus(path.resolve(__dirname, './test-corpus,comma.txt'));
    expect(corpus.matrix.length).toBe(5);
  });

  test('should throw an ExtractorError when the corpus file contains trailing comma', () => {
    expect(() => new FileCorpus(path.resolve(__dirname, './test-corpus-much-comma.txt'))).toThrow(
      ExtractorError,
    );
  });

  test('should throw Extractor Error when corpus file contains a line with only comma', () => {
    expect(() => new FileCorpus(path.resolve(__dirname, './test-corpus-comma.txt'))).toThrow(
      ExtractorError,
    );
  });

  test('should retrieve values for leading or trailing spaces', () => {
    const corpus = new FileCorpus(path.resolve(__dirname, './test-corpus-spaces.txt'));
    expect(corpus.getValue('coucou')).toBe('hello');
    expect(corpus.getValue('hi')).toBe('hello');
    expect(corpus.getValue('salut')).toBe('hello');
    expect(corpus.getValue('yo')).toBe('hello');
  });
});
