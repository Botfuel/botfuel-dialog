const { BaseDialog } = require('botfuel-dialog');

class SampleConcreteModuleDialog extends BaseDialog {
  async dialogWillDisplay() {
    return { specialData: 42 };
  }
}

module.exports = SampleConcreteModuleDialog;
