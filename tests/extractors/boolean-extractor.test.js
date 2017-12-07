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
const BooleanExtractor = require('../../src/extractors/boolean');

const extractor = new BooleanExtractor({ locale: 'en' });

describe('BooleanExtractor', function () {
  it('should properly extract', async function () {
    const entities = await extractor.compute('I say yes you say no');
    expect(entities).to.eql([
      {
        dim: 'system:boolean',
        body: 'no',
        values: [
          {
            type: 'boolean',
            value: false,
          },
        ],
        startIndex: 18,
        endIndex: 20,
      },
      {
        dim: 'system:boolean',
        body: 'yes',
        values: [
          {
            type: 'boolean',
            value: true,
          },
        ],
        startIndex: 6,
        endIndex: 9,
      },
    ]);
  });
});
