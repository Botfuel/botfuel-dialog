const Corpus = require('./corpus');

class MatrixCorpus extends Corpus {
  constructor(matrix) {
    super();
    this.matrix = matrix;
  }
}

module.exports = MatrixCorpus;
