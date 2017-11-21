const SdkError = require('./SdkError');

module.exports = class DialogError extends SdkError {
  /**
  * @constructor
  * @param {String} message - the error message
  * @param {Object} dialog - the dialog in error
  */
  constructor({ message, dialog }) {
    super(message || 'Unknown DialogError');
    this.dialog = dialog;
  }
};
