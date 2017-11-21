module.exports = class SdkError extends Error {
  /**
  * Basic error constructor that should be extended
  * @constructor
  * @param {String} message - the error message
  */
  constructor(message) {
    super(message || 'Unknown SdkError');
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
};
