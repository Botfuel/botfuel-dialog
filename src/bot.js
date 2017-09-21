const BotfuelAdapter = require('./adapters/botfuel_adapter');
const DialogManager = require('./dialog_manager');
const MessengerAdapter = require('./adapters/messenger_adapter');
const MemoryBrain = require('./brains/memory/memory_brain');
const Nlu = require('./nlu');
const ShellAdapter = require('./adapters/shell_adapter');
const TestAdapter = require('./adapters/test_adapter');
const Messages = require('./messages');

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

  run() {
    console.log('Bot.run');
    return this.adapter.run();
  }

  play(userMessages) {
    console.log('Bot.play', userMessages);
    return this.adapter.play(userMessages);
  }

  /**
   * Responds.
   */
  async sendResponse(userMessage) {
    console.log('Bot.sendResponse', userMessage);
    const type = userMessage.type;
    switch (type) {
      case Messages.TYPE_ACTIONS: // @TODO handle this
      case Messages.TYPE_POSTBACK:
        return this.sendResponseWhenPostback(userMessage);
      case Messages.TYPE_TEXT:
      default:
        return this.sendResponseWhenText(userMessage);
    }
  }

  async sendResponseWhenPostback(userMessage) {
    const userId = userMessage.user;
    const dialogLabel = userMessage.payload.value.dialog.label;
    const dialogParameters = userMessage.payload.value.dialog.parameters;
    const entities = userMessage.payload.value.entities;
    // TODO: instantiate the dialog
    const dialog = null;
    return this.dm.executeDialogs(userId, [dialog], entities);
  }

  async sendResponseWhenText(userMessage) {
    console.log('Bot.sendResponseWhenText', userMessage);
    try {
      const userId = userMessage.user;
      const sentence = userMessage.payload.value;
      const { entities, intents } = await this.nlu.compute(sentence);
      const botMessages = await this.dm.execute(userId, intents, entities)
      await this.adapter.send(botMessages);
    } catch(err) {
      console.error('Bot.sendResponseWhenText', err);
      throw err;
    }
  }

  async sendResponseWhenActions(userMessage) {
    console.log('Bot.sendResponseWhenActions', userMessage);
    // @TODO handle this
  }
}

module.exports = Bot;
