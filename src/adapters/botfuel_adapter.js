const logger = require('logtown')('BotfuelAdapter');
const WebAdapter = require('./web_adapter');

/**
 * Botfuel webchat adapter
 * @extends WebAdapter
 */
class BotfuelAdapter extends WebAdapter {
  /**
   * Handler for webchat webhook post request
   * @async
   * @param {Object} req - the request object
   * @param {Object} res - the response object
   * @returns {Promise.<void>}
   */
  async handleMessage(req, res) {
    logger.debug('handleMessage');
    res.sendStatus(200);
    const userMessage = req.body; // the message is already in the expected format
    logger.debug('handleMessage: userMessage', userMessage);
    const userId = userMessage.user;
    await this.bot.brain.initUserIfNecessary(userId);
    await this.bot.respond(userMessage);
  }

  /**
   * Build request url for a given botMessage
   * @param {Object} botMessage - the bot message
   * @returns {String} the webchat url for an user
   */
  getUrl(botMessage) {
    return `${process.env.CHAT_SERVER}/bots/${this.config.id}/users/${botMessage.user}/conversation/messages`;
  }

  /**
   * Send message to webchat for each bot messages
   * @async
   * @param {Object[]} botMessages - the bot messages
   * @returns {Promise.<void>}
   */
  async send(botMessages) {
    logger.debug('sendText', botMessages);
    for (const botMessage of botMessages) {
      // eslint-disable-next-line no-await-in-loop
      await this.postResponse({ uri: this.getUrl(botMessage), body: botMessage });
    }
  }
}

module.exports = BotfuelAdapter;
