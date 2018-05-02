const { TestAdapter } = require('botfuel-dialog');

class SampleModuleAdapter extends TestAdapter {
  constructor(bot) {
    super(bot);
    this.secretSauce = bot.config.adapter.adapterSecretSauce;
  }
}

module.exports = SampleModuleAdapter;
