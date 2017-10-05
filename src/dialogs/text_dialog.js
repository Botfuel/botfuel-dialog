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
    this.oneturn = true;
  }

  /**
   * Executes.
   * @param {string} id the user id
   */
  async execute(id, responses, messageEntities) {
    await this.textMessage(id, responses, this.label, messageEntities);
    return true;
  }
}

module.exports = TextDialog;
