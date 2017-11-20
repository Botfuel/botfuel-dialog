const logger = require('logtown')('BotfuelAdapter');
const ActionsSdkApp = require('actions-on-google').ActionsSdkApp;
const WebAdapter = require('./web_adapter');

/**
 * Adapter for GoogleAssistantAdapter.
 * @extends WebAdapter
 */
class GoogleAssistantAdapter extends WebAdapter {
  // Contains the google actions app instance
  googleApp = null;

  /**
   * Creates adapter routes
   * @param {Object} app - the express app
   * @returns {void}
   */
  createRoutes(app) {
    // Google actions checks that the GET /webhook returns 200
    app.get('/webhook', (req, res) => res.sendStatus(200));
    app.post('/webhook', (req, res) => this.handleMessage(req, res));
  }

  /**
   * Handles webchat webhook post request.
   * @async
   * @param {Object} req - the request object
   * @param {Object} res - the response object
   * @returns {Promise.<void>}
   */
  async handleMessage(req, res) {
    logger.debug('handleMessage');
    const userMessage = req.body; // the message is already in the expected format
    logger.debug('handleMessage: userMessage', userMessage);
    const userId = userMessage.user.userId;
    await this.bot.brain.initUserIfNecessary(userId);

    this.googleApp = new ActionsSdkApp({ request: req, response: res });
    const actionMap = new Map();

    // App invocation intent
    actionMap.set('actions.intent.MAIN', () => {
      const inputPrompt = this.googleApp.buildInputPrompt(false, 'Hi! Welcome to Botfuel.');
      this.googleApp.ask(inputPrompt);
    });

    // User message intent
    actionMap.set('actions.intent.TEXT', async (app) => {
      // Update the google app instance for the send method
      this.googleApp = app;
      await this.bot.respond({
        user: userId,
        type: 'text',
        payload: {
          value: app.getRawInput(),
        },
      });
    });

    this.googleApp.handleRequest(actionMap);
  }

  /**
   * Sends message to webchat for each bot message.
   * @async
   * @param {Object[]} botMessages - the bot messages
   * @returns {Promise.<void>}
   */
  async send(botMessages) {
    logger.debug('sendText', botMessages);
    for (const botMessage of botMessages) {
      // Use the ask method so the conversation continues
      // Only text messages are supported for now
      this.googleApp.ask(botMessage.payload.value);
    }
  }
}

module.exports = GoogleAssistantAdapter;
