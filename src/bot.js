const BotfuelAdapter = require('./adapters/botfuel_adapter');
const DialogManager = require('./dialog_manager');
const Dialog = require('./dialogs/dialog');
const MessengerAdapter = require('./adapters/messenger_adapter');
const MemoryBrain = require('./brains/memory_brain');
const Nlu = require('./nlu');
const ShellAdapter = require('./adapters/shell_adapter');
const TestAdapter = require('./adapters/test_adapter');
const Logger = require('logtown');

const logger = Logger.getLogger('Bot');

/**
 * Bot main class.
 */
class Bot {
  constructor(config) {
    this.configureLogger();
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

  configureLogger() {
    // TODO: create a botfuel wrapper
    // TODO: check config file
    Logger.addWrapper(function (id, level, stats, ...rest) {
      console.log(`${level} [${id}]`, ...rest);
    });
  }

  async run() {
    logger.debug('run');
    await this.init();
    return this.adapter.run();
  }

  async play(userMessages) {
    logger.debug('play', userMessages);
    await this.init();
    return this.adapter.play(userMessages);
  }

  async init() {
    await this.brain.init();
    await this.nlu.init();
  }

  /**
   * Responds.
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

  async getResponsesWhenText(userMessage) {
    logger.debug('getResponsesWhenText', userMessage);
    const { intents, entities } = await this.nlu.compute(userMessage.payload.value);
    logger.debug('getResponsesWhenText: intents, entities', intents, entities);
    return this.dm.execute(userMessage.user, intents, entities);
  }

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
