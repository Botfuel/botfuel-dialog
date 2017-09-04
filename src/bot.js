const Adapter = require('./adapters/Adapter');
const Nlu = require('./Nlu');
const DialogManager = require('./dialog_manager');

/**
 * Bot main class.
 */
class Bot {
  constructor(config) {
    this.adapter = new Adapter(); // TODO: read from config
    this.brain = null; // TODO: fix this
    this.nlu = new Nlu(config);
    this.dm = new DialogManager(this.brain, config);
  }

  /**
   * Responds.
   */
  respond(message) {
    const id = this.adapter.getId(message);
    const sentence = this.adapter.getText(message); // TODO: handle the case of non text messages
    console.log('Bot.respond', id, sentence);
    this
      .nlu
      .compute(sentence)
      .then(({ entities, intents }) => {
        console.log('Nlu.computation resolved', entities, intents);
        this
          .dm
          .execute(id, intents, entities)
          .then((responses) => {
            console.log('Dm.execution resolved', responses);
            responses.forEach((response) => {
              this.adapter.send(id, response);
            });
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
