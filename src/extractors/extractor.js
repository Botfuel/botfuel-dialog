const { MissingImplementationError } = require('../errors');

/**
 * Abstract extractor class.
 */
class Extractor {
  /**
   * Extracts the entities.
   * @abstract
   * @async
   * @param {String} sentence - the sentence
   * @returns {Promise.<Object[]>} an array of extracted entities
   */
  async compute() {
    throw new MissingImplementationError();
  }
}

module.exports = Extractor;
