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

const LocationExtractor = require('../../src/extractors/location-extractor');

describe('LocationExtractor', () => {
  test('should extract coordinates', async () => {
    const extractor = new LocationExtractor();
    const entities = await extractor.compute("I'm in NYC at coordinates 40.741895,-73.989308");
    expect(entities).toHaveLength(1);
    expect(entities[0]).toHaveProperty('body');
    expect(entities[0].dim).toBe('system:location');
    expect(entities[0].values).toEqual([{ value: { lat: '40.741895', long: '-73.989308' }, type: 'coordinates' }]);
    expect(entities[0].start).toBe(26);
    expect(entities[0].end).toBe(46);
  });
});
