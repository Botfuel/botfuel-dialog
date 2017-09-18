const Dialog = require('./dialog');

/**
 * TextDialog class.
 */
class TextDialog extends Dialog {
  /**
   * Constructor.
   */
  constructor(config, brain, label) {
    super(config, brain);
    this.label = label;
  }

  /**
   * Executes.
   * @param {string} id the user id
   */
  async execute(id, responses) {
    await this.textMessage(id, responses, this.label);
    return true;
  }
}

module.exports = TextDialog;
