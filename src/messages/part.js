const { MissingImplementationError } = require('../errors');

/**
 * A message part.
 */
class Part {
  /**
   * Converts the part to json.
   * @abstract
   * @returns {Object} the part as a json object
   */
  toJson() {
    throw new MissingImplementationError();
  }
}

module.exports = Part;
