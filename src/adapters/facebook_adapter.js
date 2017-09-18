const Adapter = require('./adapter');
const { server, receivedMessage } = require('./servers/facebook_server');

const PORT = process.env.PORT || 5000;

/**
 * Shell Adapter.
 */
class FacebookAdapter extends Adapter {
  constructor(bot, config) {
    super(bot, config);
    this.userId = 'USER_1';
    server.listen(PORT, () => {
      console.log('FacebookAdapter.constructor: server is running on port', PORT);
    });
  }

  async run() {
    console.log('FacebookAdapter.run');
    const userMessage = await this.send([{
      userId: this.userId,
      botId: this.config.id,
      type: 'text',
      payload: 'onboarding',
    }]);
  }
}

module.exports = FacebookAdapter;
