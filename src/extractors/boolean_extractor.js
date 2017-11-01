const FileCorpus = require('../corpora/file_corpus');
const CorpusExtractor = require('./corpus_extractor');

/**
 * Extract boolean entities
 * @extends CorpusExtractor
 */
class BooleanExtractor extends CorpusExtractor {
  /**
   * @constructor
   * @param {Object} parameters - the extractor parameters
   */
  constructor(parameters) {
    parameters.dimension = 'system:boolean';
    parameters.corpus = new FileCorpus(`${__dirname}/../corpora/boolean.${parameters.locale}.txt`);
    super(parameters);
  }

  /**
   * Get entity
   * @param {String} value - the entity value
   * @returns {Object} the entity
   */
  getEntity(value) {
    return { value: value === '1', type: 'boolean' };
  }
}

module.exports = BooleanExtractor;
