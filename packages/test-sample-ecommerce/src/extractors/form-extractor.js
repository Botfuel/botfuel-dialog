const { CorpusExtractor, FileCorpus } = require('botfuel-dialog');

class FormExtractor extends CorpusExtractor {
  constructor() {
    super({
      dimension: 'form',
      corpus: new FileCorpus(`${__dirname}/../corpora/form.txt`),
      options: {},
    });
  }
}

module.exports = FormExtractor;
