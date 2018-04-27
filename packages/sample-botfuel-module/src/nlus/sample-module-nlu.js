const { BotfuelNlu } = require('botfuel-dialog');

class SampleModuleNlu extends BotfuelNlu {
  constructor(config) {
    super(config);
    this.secretSauce = config.nlu.nluSecretSauce;
  }
}

module.exports = SampleModuleNlu;
