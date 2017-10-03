const fs = require('fs');
const Corpus = require('./corpus');

class FileCorpus extends Corpus {
  constructor(path, separator = ',') {
    super();
    this.path = path;
    this.separator = separator;
  }

  async init() {
    this.matrix = fs
      .readFileSync(this.path, 'utf8') // TODO: async?
      .toString()
      .split('\n')
      .slice(0, -1) // remove last empty line
      .map(row => row.split(this.separator));
  }
}

module.exports = FileCorpus;
