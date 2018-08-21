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

const CompositeExtractor = require('../../src/extractors/composite-extractor');
const WsExtractor = require('../../src/extractors/ws-extractor');

describe('CompositeExtractor', () => {
  test.only('should properly extract', async () => {
    const extractor = new CompositeExtractor({ extractors: [new WsExtractor({ locale: 'en' })] });
    const entities = await extractor.compute('I leave from Paris');
    expect(entities).toHaveLength(1);
    expect(entities[0]).toHaveProperty('body');
    expect(entities[0].dim).toBe('city');
    expect(entities[0].values[0].type).toBe('string');
    expect(entities[0].values[0].value).toBe('Paris');
    expect(entities[0].start).toBe(8);
    expect(entities[0].end).toBe(18);
  });
});
