/* eslint-disable prefer-arrow-callback */

const expect = require('expect.js');
const MatrixCorpus = require('../../src/corpora/matrix_corpus');

describe('MatrixCorpus', function () {
  it('should retrieve the correct values', async function () {
    const corpus = new MatrixCorpus([
      [ 'Paris Saint-Germain', 'Paris SG', 'PSG'],
      [ 'Olympique Lyonnais', 'L\'Olympique Lyonnais', 'OL'],
      [ 'Football Club de Nantes', 'FCN'],
      [ 'Guégan'],
    ]);
    expect(corpus.getValue('PSG')).to.be('Paris Saint-Germain');
    expect(corpus.getValue('Paris  SG')).to.be('Paris Saint-Germain');
    expect(corpus.getValue('PARIS SG')).to.not.be('Paris Saint-Germain');
    expect(corpus.getValue('Paris SG'), { caseSensitive: false }).to.be('Paris Saint-Germain');
    expect(corpus.getValue('Paris Saint Germain')).to.not.be('Paris Saint-Germain');
    expect(corpus.getValue('Paris Saint Germain', { keepDashes: false })).to.be('Paris Saint-Germain');
    expect(corpus.getValue('L Olympique Lyonnais')).to.not.be('Olympique Lyonnais');
    expect(corpus.getValue('L Olympique Lyonnais', { keepQuotes: false })).to.be('Olympique Lyonnais');
    expect(corpus.getValue('Guegan')).to.not.be('Guégan');
    expect(corpus.getValue('Guegan', { keepAccents: false })).to.be('Guégan');
  });
});
