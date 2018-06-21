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

const Corpus = require('../../src/corpora/corpus');
const CorpusExtractor = require('../../src/extractors/corpus-extractor');

const teams = new Corpus([
  ['Paris Saint-Germain', 'Paris SG', 'PSG'],
  ['Olympique Lyonnais', "L'Olympique Lyonnais", 'OL'],
  ['Football Club de Nantes', 'FCN'],
  ['Béziers'],
]);
const extractor = new CorpusExtractor({ dimension: 'teams', corpus: teams });

describe('CorpusExtractor', () => {
  test('should properly extract', async () => {
    const entities = await extractor.compute("Béziers joue contre l'Olympique Lyonnais");
    expect(entities).toHaveLength(2);
    expect(entities[0]).toHaveProperty('body');
    expect(entities[1]).toHaveProperty('body');

    expect(entities[0].dim).toBe('teams');
    expect(entities[0].values[0].type).toBe('string');
    expect(entities[0].values[0].value).toBe('Olympique Lyonnais');
    expect(entities[0].start).toBe(20);
    expect(entities[0].end).toBe(40);

    expect(entities[1].dim).toBe('teams');
    expect(entities[1].values[0].type).toBe('string');
    expect(entities[1].values[0].value).toBe('Béziers');
    expect(entities[1].start).toBe(0);
    expect(entities[1].end).toBe(7);
  });

  test('should properly extract when substring', async () => {
    const entities = await extractor.compute('LOL');
    expect(entities).toEqual([]);
  });

  test('should properly extract when several synonyms', async () => {
    const entities = await extractor.compute(
      'Paris Saint-Germain, Paris SG et PSG sont 3 synonymes.',
    );
    expect(entities).toHaveLength(3);
    expect(entities[0]).toHaveProperty('body');
    expect(entities[1]).toHaveProperty('body');
    expect(entities[2]).toHaveProperty('body');

    expect(entities[0].dim).toBe('teams');
    expect(entities[0].values[0].type).toBe('string');
    expect(entities[0].values[0].value).toBe('Paris Saint-Germain');
    expect(entities[0].start).toBe(0);
    expect(entities[0].end).toBe(19);

    expect(entities[1].dim).toBe('teams');
    expect(entities[1].values[0].type).toBe('string');
    expect(entities[1].values[0].value).toBe('Paris Saint-Germain');
    expect(entities[1].start).toBe(21);
    expect(entities[1].end).toBe(29);

    expect(entities[2].dim).toBe('teams');
    expect(entities[2].values[0].type).toBe('string');
    expect(entities[2].values[0].value).toBe('Paris Saint-Germain');
    expect(entities[2].start).toBe(33);
    expect(entities[2].end).toBe(36);
  });
});
