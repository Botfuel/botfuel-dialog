const { SampleAbstractModuleDialog } = require('sample-botfuel-module');

class ConcreteDialog extends SampleAbstractModuleDialog {
  async dialogWillDisplay() {
    return { extraData: { specialData: this.secretSauce } };
  }
}

module.exports = ConcreteDialog;
