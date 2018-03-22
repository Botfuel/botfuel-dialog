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

const RegexExtractor = require('../../src/extractors/regex-extractor');

describe('RegexExtractor', () => {
  test('should throw an error if regex is null', async () => {
    expect.assertions(1);
    try {
      await new RegexExtractor({ dimension: 'integer', regex: null });
    } catch (e) {
      expect(e.message).toMatch('the "regex" parameter can\'t be "null"');
    }
  });

  test('should throw an error if regex is undefined', async () => {
    expect.assertions(1);
    try {
      await new RegexExtractor({ dimension: 'integer' });
    } catch (e) {
      expect(e.message).toMatch('the "regex" parameter can\'t be "undefined"');
    }
  });

  test('should throw an error if regex is an empty string', async () => {
    expect.assertions(1);
    try {
      await new RegexExtractor({ dimension: 'integer', regex: '' });
    } catch (e) {
      expect(e.message).toMatch('the "regex" parameter can\'t be ""');
    }
  });

  test('should extract integers', async () => {
    const extractor = new RegexExtractor({ dimension: 'integer', regex: /[0-9]/ });
    const result = await extractor.compute('I have 1 cat and 2 birds');
    expect(result).toEqual([
      {
        dim: 'integer',
        body: '1',
        values: [{ value: '1' }],
        start: 7,
        end: 8,
      },
      {
        dim: 'integer',
        body: '2',
        values: [{ value: '2' }],
        start: 17,
        end: 18,
      },
    ]);
  });

  test('should extract a phone number', async () => {
    const extractor = new RegexExtractor({
      dimension: 'phone-number',
      regex: /(0[1-9])(?:[ _.-]?(\d{2})){4}/,
    });
    const result = await extractor.compute('My phone number is 0123456789');
    expect(result).toEqual([
      {
        dim: 'phone-number',
        body: '0123456789',
        values: [{ value: '0123456789' }],
        start: 19,
        end: 29,
      },
    ]);
  });
});
