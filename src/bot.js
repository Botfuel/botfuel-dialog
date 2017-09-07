import {MemoryBrain} from './brain';
const ShellAdapter = require('./adapters/shell_adapter');
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
    }
    this.brain = new MemoryBrain(config.id);
    this.nlu = new Nlu(config);
    this.dm = new DialogManager(this.brain, config);
  }

  async run() {
    console.log('Bot.run');
    await this.adapter.run();
  }

  async play(userMessages) {
    console.log('Bot.play', userMessages);
    for (const userMessage of userMessages) {
      await this.respond(userMessage);
    }
  }


  async onboard(id) {
    // console.log('Bot.onboard');
    // await this.brain.userPush(id, 'dialogs', lastDialog, 'onboarding');
    // this.responses = [];
    // this.executeDialogs(id, entities);
    // return this.responses);
    return this.adapter.send(id, [{ payload: "onboarding" }]);
  }

  /**
   * Responds.
   */
  async respond(userMessage) {
    console.log('Bot.respond', userMessage);
    const type = userMessage.type;
    if (type === 'text') {
      return await this.respondText(userMessage);
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
        console.log('Nlu.computation resolved', entities, intents);
        return this
          .dm
          .execute(id, intents, entities)
          .then((botMessages) => {
            console.log('Dm.execution resolved', botMessages);
            return this.adapter.send(id, botMessages); // TODO: adapt to msg type
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
