const MemoryBrain = require('./brains/memory/memory_brain');
const ShellAdapter = require('./adapters/shell_adapter');
const TestAdapter = require('./adapters/test_adapter');
const FacebookAdapter = require('./adapters/facebook_adapter');
const Nlu = require('./nlu');
const DialogManager = require('./dialog_manager');

/**
 * Bot main class.
 */
class Bot {
  constructor(config) {
    console.log('Bot.constructor', config);
    switch (config.adapter) {
      case 'facebook':
        this.adapter = new FacebookAdapter(this, config);
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
  sendResponse(userMessage) {
    console.log('Bot.sendResponse', userMessage);
    const type = userMessage.type;
    switch (type) {
      case 'text':
      default:
        return this.sendResponseWhenText(userMessage);
    }
  }

  sendResponseWhenText(userMessage) {
    console.log('Bot.sendResponseWhenText', userMessage);
    const userId = userMessage.userId;
    const sentence = userMessage.payload;
    return this
      .nlu
      .compute(sentence)
      .then(({ entities, intents }) => {
        return this
          .dm
          .execute(userId, intents, entities)
          .then((botMessages) => {
            return this.adapter.send(botMessages); // TODO: adapt to msg type
          })
          .catch((err) => {
            console.log('Dm.execution rejected', err);
          });
      })
      .catch((err) => {
        console.log('Nlu.computation rejected', err);
      });
  }
}

module.exports = Bot;
