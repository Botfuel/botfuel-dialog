const Messages = require('../messages');
const WebAdapter = require('./web_adapter');

class BotfuelAdapter extends WebAdapter {
  /**
   * Handler for webchat webhook post request
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise}
   */
  async handleMessage(req, res) {
    console.log('BotfuelAdapter.handleMessage');
    res.sendStatus(200);
    const userMessage = req.body; // the message is already in the expected format
    console.log('BotfuelAdapter.handleMessage: userMessage', userMessage);
    const userId = userMessage.user;
    await this.bot.brain.initUserIfNecessary(userId);
    await this.bot.sendResponse(userMessage);
  }

  /**
   * Build request url for a given botMessage
   * @param {Object} botMessage
   * @returns {string}
   */
  getUrl(botMessage) {
    return `${process.env.CHAT_SERVER}/bots/${this.config.id}/users/${botMessage.user}/conversation/messages`;
  }

  /**
   * @param {Object} botMessage
   * @returns {Promise}
   */
  async sendText(botMessage) {
    console.log('BotfuelAdapter.sendText', botMessage);
    await this.postResponse({ uri: this.getUrl(botMessage), body: botMessage });
  }

  /**
   * @param {Object} botMessage
   * @returns {Promise}
   */
  async sendActions(botMessage) {
    console.log('BotfuelAdapter.sendActions', botMessage);
    await this.postResponse({ uri: this.getUrl(botMessage), body: botMessage });
  }
}

module.exports = BotfuelAdapter;
