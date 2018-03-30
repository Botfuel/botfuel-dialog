const { CorpusExtractor, FileCorpus } = require('botfuel-dialog');

class BrandExtractor extends CorpusExtractor {
  constructor() {
    super({
      dimension: 'brand',
      corpus: new FileCorpus(`${__dirname}/../corpora/brand.txt`),
      options: {},
    });
  }
}

module.exports = BrandExtractor;
