const SdkError = require('./SdkError');

module.exports = class ViewError extends SdkError {
  constructor({ message, view }) {
    super(message || 'Unknown ViewError');
    this.view = view;
  }
};
