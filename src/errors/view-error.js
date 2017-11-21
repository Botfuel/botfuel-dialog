const SdkError = require('./SdkError');

module.exports = class ViewError extends SdkError {
  /**
  * @constructor
  * @param {String} message - the error message
  * @param {Object} view - the view in error
  */
  constructor({ message, view }) {
    super(message || 'Unknown ViewError');
    this.view = view;
  }
};
