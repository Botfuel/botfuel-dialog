const Dialog = require('../../../../src/dialogs/dialog');

/**
 * FalseDialog class.
 */
class FalseDialog extends Dialog {
  /**
   * Executes.
   * @returns {string}
   */
  async execute() {
    return { status: Dialog.STATUS_WAITING };
  }
}

FalseDialog.params = {
  namespace: 'false',
};

module.exports = FalseDialog;
