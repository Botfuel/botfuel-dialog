/* eslint-disable prefer-arrow-callback */

const expect = require('expect.js');
const Corpus = require('../../src/corpora/corpus');
const MatrixCorpus = require('../../src/corpora/matrix_corpus');

describe('MatrixCorpus', function () {
  it('should properly handle case sensitive', function () {
    expect(Corpus.matches('a', 'A', { caseSensitive: true })).to.be(false);
    expect(Corpus.matches('a', 'A')).to.be(true);
  });

  it('should retrieve the correct values', function () {
    const corpus = new MatrixCorpus([
      ['Paris Saint-Germain', 'Paris SG', 'PSG'],
      ['Olympique Lyonnais', 'L\'Olympique Lyonnais', 'OL'],
      ['Football Club de Nantes', 'FCN'],
      ['Guégan'],
    ]);
    expect(corpus.getValue('PSG')).to.be('Paris Saint-Germain');
    expect(corpus.getValue('Paris  SG')).to.be('Paris Saint-Germain');
    expect(corpus.getValue('PARIS SG')).to.be('Paris Saint-Germain');
    expect(corpus.getValue('PARIS SG', { caseSensitive: true })).to.not.be('Paris Saint-Germain');
    expect(corpus.getValue('Paris Saint Germain')).to.be('Paris Saint-Germain');
    expect(corpus.getValue('Paris Saint Germain', { keepDashes: true })).to.not.be('Paris Saint-Germain');
    expect(corpus.getValue('L Olympique Lyonnais')).to.be('Olympique Lyonnais');
    expect(corpus.getValue('L Olympique Lyonnais', { keepQuotes: true })).to.not.be('Olympique Lyonnais');
    expect(corpus.getValue('Guegan')).to.be('Guégan');
    expect(corpus.getValue('Guegan', { keepAccents: true })).to.not.be('Guégan');
  });
});
