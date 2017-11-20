const SdkError = require('./SdkError');

module.exports = class DialogError extends SdkError {
  constructor({ message, dialog }) {
    super(message || 'Unknown DialogError');
    this.dialog = dialog;
  }
};
