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
const Corpus = require('../../src/corpora/corpus');
const CorpusExtractor = require('../../src/extractors/corpus-extractor');

const teams = new Corpus([
  ['Paris Saint-Germain', 'Paris SG', 'PSG'],
  ['Olympique Lyonnais', "L'Olympique Lyonnais", 'OL'],
  ['Football Club de Nantes', 'FCN'],
  ['Béziers'],
]);
const extractor = new CorpusExtractor({ dimension: 'teams', corpus: teams });

describe('CorpusExtractor', function () {
  it('should properly extract', async function () {
    const entities = await extractor.compute("Béziers joue contre l'Olympique Lyonnais");
    expect(entities).to.eql([
      {
        dim: 'teams',
        body: "L'Olympique Lyonnais",
        values: [
          {
            type: 'string',
            value: 'Olympique Lyonnais',
          },
        ],
        start: 20,
        end: 40,
      },
      {
        dim: 'teams',
        body: 'Béziers',
        values: [
          {
            type: 'string',
            value: 'Béziers',
          },
        ],
        start: 0,
        end: 7,
      },
    ]);
  });

  it('should properly extract when substring', async function () {
    const entities = await extractor.compute('LOL');
    expect(entities).to.eql([]);
  });

  it('should properly extract when several synonyms', async function () {
    const entities = await extractor.compute(
      'Paris Saint-Germain, Paris SG et PSG sont 3 synonymes.',
    );
    expect(entities).to.eql([
      {
        dim: 'teams',
        body: 'Paris Saint-Germain',
        values: [
          {
            type: 'string',
            value: 'Paris Saint-Germain',
          },
        ],
        start: 0,
        end: 19,
      },
      {
        dim: 'teams',
        body: 'Paris SG',
        values: [
          {
            type: 'string',
            value: 'Paris Saint-Germain',
          },
        ],
        start: 21,
        end: 29,
      },
      {
        dim: 'teams',
        body: 'PSG',
        values: [
          {
            type: 'string',
            value: 'Paris Saint-Germain',
          },
        ],
        start: 33,
        end: 36,
      },
    ]);
  });
});
