const Message = require('@botfuel/bot-common').Message;

/**
 * Bot main class.
 */
class Bot {
  /**
   * Responds.
   */
  respond(res) {
    const id = Message.getUser(res).id;
    const sentence = Message.getSentence(res);
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
              this.send(res, response);
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

  send(res, response) {
    console.log('Bot.send', '<res>', response);
    // when text (TODO: fix this)
    res.send(response.payload);
  }
}

module.exports = Bot;
