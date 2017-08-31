/**
 * Dialog main class.
 */
class Dialog {
  /**
   * Constructor.
   * @param {Object} parameters the dialog parameters
   */
  constructor(parameters) {
    console.log('Dialog.constructor', parameters);
    this.parameters = parameters;
  }
}

module.exports = Dialog;
