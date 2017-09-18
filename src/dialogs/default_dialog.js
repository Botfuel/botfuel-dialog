const TextDialog = require('./text_dialog');

/**
 * DefaultDialog class.
 */
class DefaultDialog extends TextDialog {
  constructor(config, brain) {
    super(config, brain, 'default');
    this.templatePath = `${__dirname}/../templates`;
  }
}

module.exports = DefaultDialog;
