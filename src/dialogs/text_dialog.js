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
    this.maxComplexity = 1;
  }

  /**
   * Executes.
   * @param {string} id the user id
   */
  async execute(id, responses, messageEntities, age) {
    console.log('TextDialog.execute', id, responses, messageEntities, age);
    await this.textMessage(id, responses, this.label, messageEntities);
    return true;
  }
}

module.exports = TextDialog;
