const Dialog = require('../../../../../src/dialogs/dialog');

/**
 * FalseDialog class.
 */
class FalseDialog extends Dialog {
  /**
   * Executes.
   */
  async execute() {
    return Dialog.STATUS_WAITING;
  }
}

module.exports = FalseDialog;
