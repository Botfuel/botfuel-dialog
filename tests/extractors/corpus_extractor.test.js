/* eslint-disable prefer-arrow-callback */

const expect = require('expect.js');
const MatrixCorpus = require('../../src/corpora/matrix_corpus');
const CorpusExtractor = require('../../src/extractors/corpus_extractor');

const teams = new MatrixCorpus([
  ['Paris Saint-Germain', 'Paris SG', 'PSG'],
  ['Olympique Lyonnais', 'L\'Olympique Lyonnais', 'OL'],
  ['Football Club de Nantes', 'FCN'],
  ['Guégan'],
]);

describe('CorpusExtractor', function () {
  it('should properly extract', async function () {
    const extractor = new CorpusExtractor('teams', teams);
    const entities = await extractor.compute('Guégan joue contre l\'Olympique Lyonnais');
    expect(entities).to.eql([
      {
        dim: 'teams',
        values: [
          {
            type: 'string',
            value: 'Olympique Lyonnais',
          },
        ],
      },
      {
        dim: 'teams',
        values: [
          {
            type: 'string',
            value: 'Guégan',
          },
        ],
      },
    ]);
  });

  it('should properly extract when substring', async function () {
    const extractor = new CorpusExtractor('teams', teams);
    const entities = await extractor.compute('LOL');
    expect(entities).to.eql([]);
  });
});
