const { CorpusExtractor, FileCorpus } = require('botfuel-dialog');

class SizeExtractor extends CorpusExtractor {
  constructor() {
    super({
      dimension: 'size',
      corpus: new FileCorpus(`${__dirname}/../corpora/size.txt`),
      options: {},
    });
  }
}

module.exports = SizeExtractor;
