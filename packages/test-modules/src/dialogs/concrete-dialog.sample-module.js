const { SampleAbstractModuleDialog } = require('botfuel-module-sample');

class ConcreteDialog extends SampleAbstractModuleDialog {
  async dialogWillDisplay() {
    return { extraData: { specialData: this.secretSauce } };
  }
}

module.exports = ConcreteDialog;
