const fs = require('fs');
const Logger = require('logtown');
const BotfuelAdapter = require('./adapters/botfuel_adapter');
const DialogManager = require('./dialog_manager');
const Dialog = require('./dialogs/dialog');
const MessengerAdapter = require('./adapters/messenger_adapter');
const MemoryBrain = require('./brains/memory_brain');
const Nlu = require('./nlu');
const ShellAdapter = require('./adapters/shell_adapter');
const TestAdapter = require('./adapters/test_adapter');

const logger = Logger.getLogger('Bot');

/**
 * This is the bot main class.
 * A bot has :
 * - an {@link Adapter},
 * - a {@link Brain},
 * - a {@link Nlu} (Natural Language Understanding) module,
 * - a {@link DialogManager}.
 */
class Bot {
  /**
   * @constructor
   * @param {object} config - the bot configuration
   */
  constructor(config) {
    this.configureLogger(config);
    logger.debug('constructor', config);
    switch (config.adapter) {
      case 'botfuel':
        this.adapter = new BotfuelAdapter(this, config);
        break;
      case 'messenger':
        this.adapter = new MessengerAdapter(this, config);
        break;
      case 'test':
        this.adapter = new TestAdapter(this, config);
        break;
      case 'shell':
      default:
        this.adapter = new ShellAdapter(this, config);
    }
    this.brain = new MemoryBrain(config.id);
    this.nlu = new Nlu(config);
    this.dm = new DialogManager(this.brain, config);
  }

  /**
<<<<<<< HEAD
   * Configures the logger.
   * @param {object} config - the bot configuration
   */
  configureLogger(config) {
    const paths = [
      `${config.path}/src/loggers/${config.logger}.js`,
      `${__dirname}/loggers/${config.logger}.js`,
    ];
    for (const path of paths) {
      if (fs.existsSync(path)) {
        const logger = require(path);
        if (logger.wrapper) {
          // clean wrappers
          Logger.clean();
          Logger.addWrapper(logger.wrapper);
        }
        if (logger.config) {
          Logger.configure(logger.config);
        }
        break;
      }
    }
  }

  /**
   * Runs the bot.
=======
   * Run the bot.
>>>>>>> 1f4295cd6f9ae086086784fd90da212d6a1fb152
   * @async
   * @returns {Promise.<void>}
   */
  async run() {
    logger.debug('run');
    await this.init();
    await this.adapter.run();
  }

  /**
   * Plays user messages (only available with the {@link TestAdapter}).
   * @async
<<<<<<< HEAD
   * @param {string[]} userMessages - the user messages
=======
   * @param {Object[]} userMessages - user messages
>>>>>>> 1f4295cd6f9ae086086784fd90da212d6a1fb152
   * @returns {Promise.<void>}
   */
  async play(userMessages) {
    logger.debug('play', userMessages);
    await this.init();
    await this.adapter.play(userMessages);
  }

  /**
<<<<<<< HEAD
   * Initializes the bot.
   * @async
   * @private
   * @returns {Promise.<void>}
   */
  async init() {
    await this.brain.init();
    await this.nlu.init();
  }

  /**
   * Responds to the user.
   * @async
   * @param {object} userMessage - the user message
=======
   * Send bot responses to user
   * @async
   * @param {Object} userMessage - user message
>>>>>>> 1f4295cd6f9ae086086784fd90da212d6a1fb152
   * @returns {Promise.<void>}
   */
  async sendResponse(userMessage) {
    logger.debug('sendResponse', userMessage);
    try {
      const responses = await this.getResponses(userMessage);
      logger.debug('sendResponse: responses', responses);
      return this.adapter.send(responses);
    } catch (err) {
      logger.error('sendResponse', err);
      throw err;
    }
  }

  /**
<<<<<<< HEAD
   * Computes the responses.
   * @async
   * @private
   * @param {object} userMessage - the user message
   * @returns {Promise.<object[]>}
=======
   * Initialize bot modules
   * @private
   * @async
   * @returns {Promise.<void>}
   */
  async init() {
    await this.brain.init();
    await this.nlu.init();
  }

  /**
   * Configure bot logger
   * @private
   * @param {Object} config - the bot config
   * @returns {void}
   */
  configureLogger(config) {
    const paths = [
      `${config.path}/src/loggers/${config.logger}.js`,
      `${__dirname}/loggers/${config.logger}.js`,
    ];
    for (const path of paths) {
      if (fs.existsSync(path)) {
        const loggerConfig = require(path);
        if (loggerConfig.wrapper) {
          Logger.clean(); // clean wrappers
          Logger.addWrapper(loggerConfig.wrapper);
        }
        if (loggerConfig.config) {
          Logger.configure(loggerConfig.config);
        }
        break;
      }
    }
  }

  /**
   * Get responses based on user message type
   * @private
   * @async
   * @param {Object} userMessage - user message
   * @returns {Promise.<Object[]>} the responses
>>>>>>> 1f4295cd6f9ae086086784fd90da212d6a1fb152
   */
  async getResponses(userMessage) {
    logger.debug('getResponses', userMessage);
    switch (userMessage.type) {
      case 'postback':
        return this.getResponsesWhenPostback(userMessage);
      case 'image': // TODO: review this
        return this.getResponsesWhenDownload(userMessage);
      case 'text':
      default:
        return this.getResponsesWhenText(userMessage);
    }
  }

  /**
<<<<<<< HEAD
   * Computes the responses for a user message of type text.
   * @async
   * @private
   * @param {object} userMessage - the user text message
   * @returns {Promise.<object[]>}
=======
   * Get responses for a given user text message
   * @private
   * @async
   * @param {Object} userMessage - user message
   * @returns {Promise.<Object[]>} the responses
>>>>>>> 1f4295cd6f9ae086086784fd90da212d6a1fb152
   */
  async getResponsesWhenText(userMessage) {
    logger.debug('getResponsesWhenText', userMessage);
    const { intents, entities } = await this.nlu.compute(userMessage.payload.value);
    logger.debug('getResponsesWhenText: intents, entities', intents, entities);
    return this.dm.execute(userMessage.user, intents, entities);
  }

  /**
<<<<<<< HEAD
   * Computes the responses for a user message of type postback.
   * @async
   * @private
   * @param {object} userMessage - the user postback message
   * @returns {Promise.<object[]>}
=======
   * Get responses for a given user postback message
   * @private
   * @async
   * @param {Object} userMessage - user message
   * @returns {Promise.<Object[]>} the responses
>>>>>>> 1f4295cd6f9ae086086784fd90da212d6a1fb152
   */
  async getResponsesWhenPostback(userMessage) {
    logger.debug('getResponsesWhenPostback', userMessage);
    return this.dm.executeDialogs(
      userMessage.user,
      [{
        label: userMessage.payload.value.dialog,
        status: Dialog.STATUS_READY,
        entities: userMessage.payload.value.entities,
      }],
    );
  }

  /**
<<<<<<< HEAD
   * Computes the responses for a user message of type image.
   * @async
   * @private
   * @param {object} userMessage - the user image message
   * @returns {Promise.<object[]>}
=======
   * Get responses for a given user image message
   * @private
   * @async
   * @param {Object} userMessage - user message
   * @returns {Promise.<Object[]>} the responses
>>>>>>> 1f4295cd6f9ae086086784fd90da212d6a1fb152
   */
  async getResponsesWhenDownload(userMessage) { // TODO: rename
    logger.debug('getResponsesWhenDownload', userMessage);
    return this.dm.executeDialogs(
      userMessage.user,
      [{
        label: 'image',
        status: Dialog.STATUS_READY,
        entities: [{ url: userMessage.payload.value.url }],
      }],
    );
  }
}

module.exports = Bot;
