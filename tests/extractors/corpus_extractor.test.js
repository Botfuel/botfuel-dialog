/* eslint-disable prefer-arrow-callback */

const expect = require('expect.js');
const Corpus = require('../../src/corpora/corpus');
const CorpusExtractor = require('../../src/extractors/corpus_extractor');

const teams = new Corpus([
  ['Paris Saint-Germain', 'Paris SG', 'PSG'],
  ['Olympique Lyonnais', 'L\'Olympique Lyonnais', 'OL'],
  ['Football Club de Nantes', 'FCN'],
  ['Béziers'],
]);
const extractor = new CorpusExtractor({ dimension: 'teams', corpus: teams });

describe('CorpusExtractor', function () {
  it('should properly extract', async function () {
    const entities = await extractor.compute('Béziers joue contre l\'Olympique Lyonnais');
    expect(entities).to.eql([
      {
        dim: 'teams',
        body: 'Olympique Lyonnais',
        values: [
          {
            type: 'string',
            value: 'Olympique Lyonnais',
          },
        ],
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
      },
    ]);
  });

  it('should properly extract when substring', async function () {
    const entities = await extractor.compute('LOL');
    expect(entities).to.eql([]);
  });
});
