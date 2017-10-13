const BotfuelAdapter = require('./adapters/botfuel_adapter');
const DialogManager = require('./dialog_manager');
const MessengerAdapter = require('./adapters/messenger_adapter');
const MemoryBrain = require('./brains/memory_brain');
const Nlu = require('./nlu');
const ShellAdapter = require('./adapters/shell_adapter');
const TestAdapter = require('./adapters/test_adapter');

/**
 * Bot main class.
 */
class Bot {
  constructor(config) {
    console.log('Bot.constructor', config);
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

  async run() {
    console.log('Bot.run');
    await this.init();
    return this.adapter.run();
  }

  async play(userMessages) {
    console.log('Bot.play', userMessages);
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
    console.log('Bot.sendResponse', userMessage);
    try {
      return this.adapter.send(await this.getResponses(userMessage));
    } catch (err) {
      console.error('Bot.sendResponse', err);
      throw err;
    }
  }

  async getResponses(userMessage) {
    // console.log('Bot.getResponses', userMessage);
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

  async getResponsesWhenPostback(userMessage) {
    console.log('Bot.getResponsesWhenPostback', userMessage);
    const { dialog, entities } = userMessage.payload.value;
    console.log('Bot.getResponsesWhenPostback: dialog, entities', dialog, entities);
    return this.dm.executeDialogs(userMessage.user, [dialog], entities);
  }

  async getResponsesWhenText(userMessage) {
    console.log('Bot.getResponsesWhenText', userMessage);
    const { intents, entities } = await this.nlu.compute(userMessage.payload.value);
    console.log('Bot.getResponsesWhenText: intents, entities', intents, entities);
    return this.dm.execute(userMessage.user, intents, entities);
  }

  async getResponsesWhenDownload(userMessage) { // TODO: rename
    console.log('Bot.getResponsesWhenDownload', userMessage);
    const entities = [{ url: userMessage.payload.value.url }];
    const dialog = { label: 'image' };
    console.log('Bot.getResponsesWhenPostback: dialog, entities', dialog, entities);
    return this.dm.executeDialogs(userMessage.user, [dialog], entities);
  }
}

module.exports = Bot;
