const { SampleAbstractModuleDialog } = require('botfuel-module-sample');

class ConcreteDialog extends SampleAbstractModuleDialog {
  async dialogWillDisplay() {
    return { specialData: this.secretSauce };
  }
}

module.exports = ConcreteDialog;
