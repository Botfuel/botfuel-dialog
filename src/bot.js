const MemoryBrain = require('./brains/memory/memory_brain');
const ShellAdapter = require('./adapters/shell_adapter');
const TestAdapter = require('./adapters/test_adapter');
const Nlu = require('./nlu');
const DialogManager = require('./dialog_manager');

/**
 * Bot main class.
 */
class Bot {
  constructor(config) {
    console.log('Bot.constructor', config);
    if (config.adapter === 'test') {
      this.adapter = new TestAdapter(this, config);
    } else {
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
    console.log('Bot.respond', userMessage);
    const type = userMessage.type;
    switch (type) {
      case 'text':
      default:
        return this.sendTextResponse(userMessage);
    }
  }

  sendTextResponse(userMessage) {
    console.log('Bot.respondText', userMessage);
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
            console.log('Dm.execution resolved', botMessages);
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
