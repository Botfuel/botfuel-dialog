const { BaseDialog } = require('botfuel-dialog');

class SampleAbstractModuleDialog extends BaseDialog {
  constructor(...args) {
    super(...args);
    this.secretSauce = 42;
  }
}

module.exports = SampleAbstractModuleDialog;
