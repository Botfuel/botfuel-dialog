const { CorpusExtractor, FileCorpus } = require('botfuel-dialog');

class SleaveExtractor extends CorpusExtractor {
  constructor() {
    super({
      dimension: 'sleave',
      corpus: new FileCorpus(`${__dirname}/../corpora/sleave.txt`),
      options: {},
    });
  }
}

module.exports = SleaveExtractor;
