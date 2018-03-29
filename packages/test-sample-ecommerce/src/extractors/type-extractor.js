const { CorpusExtractor, FileCorpus } = require('botfuel-dialog');

class TypeExtractor extends CorpusExtractor {
  constructor() {
    super({
      dimension: 'type',
      corpus: new FileCorpus(`${__dirname}/../corpora/type.txt`),
      options: {},
    });
  }
}

module.exports = TypeExtractor;
