const Adapter = require('./adapter');

/**
 * Shell Adapter.
 */
class ShellAdapter extends Adapter {
  constructor(bot, config) {
    super(bot, config);
    this.userId = 'USER_1';
  }

  async run() {
    console.log('FacebookAdapter.run');
    await this.initUserIfNecessary(this.userId);
    const userMessage = await this.send([{
      userId: this.userId,
      botId: this.config.id,
      type: 'text',
      payload: 'onboarding', // TODO: use a dialog instead?
    }]);
    this.loop(userMessage);
  }
}

module.exports = ShellAdapter;
