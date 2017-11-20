module.exports = class SdkError extends Error {
  constructor(message) {
    super(message || 'Unknown SdkError');
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
};
