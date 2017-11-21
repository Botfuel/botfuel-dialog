const logger = require('logtown')('BotfuelAdapter');
const WebAdapter = require('./web-adapter');

/**
 * Adapter for Botfuel's webchat.
 * @extends WebAdapter
 */
class BotfuelAdapter extends WebAdapter {
  // eslint-disable-next-line require-jsdoc
  async handleMessage(req, res) {
    logger.debug('handleMessage');
    res.sendStatus(200);
    const userMessage = req.body; // the message is already in the expected format
    logger.debug('handleMessage: userMessage', userMessage);
    const userId = userMessage.user;
    await this.bot.brain.initUserIfNecessary(userId);
    await this.bot.respond(userMessage);
  }

  // eslint-disable-next-line require-jsdoc
  getUri(botMessage) {
    return `${process.env.CHAT_SERVER}/bots/${this.bot.id}/users/${botMessage.user}/conversation/messages`;
  }

  // eslint-disable-next-line require-jsdoc
  getQs() {
    return {};
  }

  // eslint-disable-next-line require-jsdoc
  getBody(botMessage) {
    return botMessage;
  }
}

module.exports = BotfuelAdapter;
