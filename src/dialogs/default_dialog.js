const TextDialog = require('./text_dialog');

/**
 * DefaultDialog class.
 */
class DefaultDialog extends TextDialog {
  constructor(config, brain) {
    super(config, brain, { template: 'default' });
    this.templatePath = `${__dirname}/../views/templates`;
  }
}

module.exports = DefaultDialog;
