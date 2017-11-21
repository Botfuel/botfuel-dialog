const SdkError = require('./sdk-error');

module.exports = class MissingImplementationError extends SdkError {
  /**
   * @constructor
   */
  constructor() {
    super('Not implemented!');
  }
};
