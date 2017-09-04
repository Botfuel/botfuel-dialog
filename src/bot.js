/**
 * Bot main class.
 */
class Bot {
  constructor(adapter) {
    this.adapter = adapter;
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
