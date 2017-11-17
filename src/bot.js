const Logger = require('logtown');
const BotfuelAdapter = require('./adapters/botfuel_adapter');
const DialogManager = require('./dialog_manager');
const Dialog = require('./dialogs/dialog');
const LoggerManager = require('./logger_manager');
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
    LoggerManager.configure(config);
    this.id = process.env.BOT_ID;
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
    this.brain = new MemoryBrain(this.id);
    this.nlu = new Nlu(config);
    this.dm = new DialogManager(this.brain, config);
  }

  /**
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
   * Runs the bot.
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
   * @param {string[]} userMessages - the user messages
   * @returns {Promise.<void>}
   */
  async play(userMessages) {
    logger.debug('play', userMessages);
    await this.init();
    await this.adapter.play(userMessages);
  }

  /**
   * Responds to the user.
   * @async
   * @param {object} userMessage - the user message
   * @returns {Promise.<void>}
   */
  async respond(userMessage) {
    logger.debug('respond', userMessage);
    switch (userMessage.type) {
      case 'postback':
        return this.respondWhenPostback(userMessage);
      case 'image':
        return this.respondWhenImage(userMessage);
      case 'text':
      default:
        return this.respondWhenText(userMessage);
    }
  }

  /**
   * Computes the responses for a user message of type text.
   * @async
   * @private
   * @param {object} userMessage - the user text message
   * @returns {Promise.<void>}
   */
  async respondWhenText(userMessage) {
    logger.debug('respondWhenText', userMessage);
    const { intents, entities } = await this.nlu.compute(userMessage.payload.value);
    logger.debug('respondWhenText: intents, entities', intents, entities);
    return this.dm.execute(this.adapter, userMessage.user, intents, entities);
  }

  /**
   * Computes the responses for a user message of type postback.
   * @async
   * @private
   * @param {object} userMessage - the user postback message
   * @returns {Promise.<void>}
   */
  async respondWhenPostback(userMessage) {
    logger.debug('respondWhenPostback', userMessage);
    return this.dm.executeDialogs(
      this.adapter,
      userMessage.user,
      {
        stack: [
          {
            label: userMessage.payload.value.dialog,
            status: Dialog.STATUS_READY,
            entities: userMessage.payload.value.entities,
          },
        ],
      },
    );
  }

  /**
   * Computes the responses for a user message of type image.
   * @async
   * @private
   * @param {object} userMessage - the user image message
   * @returns {Promise.<void>}
   */
  async respondWhenImage(userMessage) {
    logger.debug('respondWhenImage', userMessage);
    return this.dm.executeDialogs(
      this.adapter,
      userMessage.user,
      {
        stack: [
          {
            label: 'image',
            status: Dialog.STATUS_READY,
            entities: [{ url: userMessage.payload.value.url }],
          },
        ],
      },
    );
  }
}

module.exports = Bot;
