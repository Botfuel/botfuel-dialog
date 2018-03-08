const { TestAdapter } = require('botfuel-dialog');

class CustomTestAdapter extends TestAdapter {
  constructor(bot) {
    super(bot);
    this.secretSauce = bot.config.adapter.adapterSecretSauce;
  }
}

module.exports = CustomTestAdapter;
