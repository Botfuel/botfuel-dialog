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

const BooleanExtractor = require('../../src/extractors/boolean-extractor');

const extractor = new BooleanExtractor({ locale: 'en' });

describe('BooleanExtractor', () => {
  test('should properly extract', async () => {
    const entities = await extractor.compute('I say yes you say no');
    expect(entities).toHaveLength(2);
    expect(entities[0]).toHaveProperty('body');
    expect(entities[1]).toHaveProperty('body');

    expect(entities[0].dim).toBe('system:boolean');
    expect(entities[0].values[0].type).toBe('boolean');
    expect(entities[0].values[0].value).toBe(false);
    expect(entities[0].start).toBe(18);
    expect(entities[0].end).toBe(20);

    expect(entities[1].dim).toBe('system:boolean');
    expect(entities[1].values[0].type).toBe('boolean');
    expect(entities[1].values[0].value).toBe(true);
    expect(entities[1].start).toBe(6);
    expect(entities[1].end).toBe(9);
  });
});
