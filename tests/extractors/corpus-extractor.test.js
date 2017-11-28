/* eslint-disable prefer-arrow-callback */

const expect = require('expect.js');
const Corpus = require('../../src/corpora/corpus');
const CorpusExtractor = require('../../src/extractors/corpus-extractor');

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
        body: 'L\'Olympique Lyonnais',
        values: [
          {
            type: 'string',
            value: 'Olympique Lyonnais',
          },
        ],
        startIndex: 20,
        endIndex: 40,
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
        startIndex: 0,
        endIndex: 7,
      },
    ]);
  });

  it('should properly extract when substring', async function () {
    const entities = await extractor.compute('LOL');
    expect(entities).to.eql([]);
  });

    it('should properly extract when several synonyms', async function () {
    const entities = await extractor.compute('Paris Saint-Germain, Paris SG et PSG sont 3 synonymes.');
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
        startIndex: 0,
        endIndex: 19,
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
        startIndex: 21,
        endIndex: 29,
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
        startIndex: 33,
        endIndex: 36,
      },
    ]);
  });

});
