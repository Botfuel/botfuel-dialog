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
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('body');
    expect(result[0].dim).toBe('integer');
    expect(result[0].values[0].value).toBe('1');
    expect(result[0].start).toBe(7);
    expect(result[0].end).toBe(8);

    expect(result[1]).toHaveProperty('body');
    expect(result[1].dim).toBe('integer');
    expect(result[1].values[0].value).toBe('2');
    expect(result[1].start).toBe(17);
    expect(result[1].end).toBe(18);
  });

  test('should extract a phone number', async () => {
    const extractor = new RegexExtractor({
      dimension: 'phone-number',
      regex: /(0[1-9])(?:[ _.-]?(\d{2})){4}/,
    });
    const result = await extractor.compute('My phone number is 0123456789');
    expect(result[0]).toHaveProperty('body');
    expect(result[0].dim).toBe('phone-number');
    expect(result[0].values[0].value).toBe('0123456789');
    expect(result[0].start).toBe(19);
    expect(result[0].end).toBe(29);
  });
});
