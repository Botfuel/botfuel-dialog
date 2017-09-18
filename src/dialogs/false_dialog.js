const Dialog = require('./dialog');

/**
 * FalseDialog class.
 */
class FalseDialog extends Dialog {
  /**
   * Constructor.
   */
  constructor(config, brain) {
    super(config, brain);
  }

  /**
   * Executes.
   * @param {string} id the user id
   */
  async execute(id, responses) {
    return false;
  }
}

module.exports = FalseDialog;
