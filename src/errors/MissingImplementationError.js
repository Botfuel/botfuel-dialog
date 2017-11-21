const SdkError = require('./SdkError');

module.exports = class MissingImplementationError extends SdkError {
  /**
   * @constructor
   */
  constructor() {
    super('Not implemented!');
  }
};
