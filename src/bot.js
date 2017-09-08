const MemoryBrain = require('./brain/memory/memory_brain');
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
    if (config.adapter === 'shell') {
      this.adapter = new ShellAdapter(this, config);
    } else if (config.adapter === 'test') {
      this.adapter = new TestAdapter(this, config);
    }
    this.brain = new MemoryBrain(config.id);
    this.nlu = new Nlu(config);
    this.dm = new DialogManager(this.brain, config);
  }

  run() {
    console.log('Bot.run');
    this.adapter.run();
  }

  play(userMessages) {
    console.log('Bot.play', userMessages);
    this.adapter.play(userMessages);
  }

  /**
   * Responds.
   */
  respond(userMessage) {
    console.log('Bot.respond', userMessage);
    const type = userMessage.type;
    if (type === 'text') {
      return this.respondText(userMessage);
    }
  }

  respondText(userMessage) {
    console.log('Bot.respondText', userMessage);
    const id = userMessage.id;
    const sentence = userMessage.payload;
    return this
      .nlu
      .compute(sentence)
      .then(({ entities, intents }) => {
        return this
          .dm
          .execute(id, intents, entities)
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

  async onboard(id) {
    // console.log('Bot.onboard');
    // await this.brain.userPush(id, 'dialogs', lastDialog, 'onboarding');
    // this.responses = [];
    // this.executeDialogs(id, entities);
    // return this.responses);
    return this.adapter.send([{
      id,
      type: 'text',
      payload: "onboarding"
    }]);
  }
}

module.exports = Bot;
