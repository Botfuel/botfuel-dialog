'use strict';

const Message = require('@botfuel/bot-common').Message;
const DialogManager = require('./dialog_manager');
const Nlu = require('./nlu');

/**
  * Bot main class.
  * Only this class knows about Hubot.
  */
class Bot {
  /**
   * @param {Object} hubot an hubot robot
   */
  constructor(hubot, config, path) {
    console.log("Bot.constructor", "<hubot>", config, path);
    this.config = config;
    this.path = path;
    this.nlu = new Nlu(hubot.brain, config, path);
    this.dm = new DialogManager(hubot.brain, config, path);
  }

  /**
   * Responds.
   * @param {Response} res Hubot's response object
   */
  respond(res) {
    console.log("Bot.respond");
    let id = Message.getUser(res).id;
    let sentence = Message.getSentence(res);
    console.log("Bot.respond", id, sentence);
    this
      .nlu
      .compute(sentence)
      .then(({ entities: entities, intents: intents }) => {
        console.log("Nlu.computation resolved", entities, intents);
        this
          .dm
          .execute(id, intents, entities)
          .then((responses) => {
            console.log("Dm.execution resolved", responses);
            responses.forEach((response) => {
              res.send(response);
            }); // TODO: do we need to wait here?
          })
          .catch((err) => {
            console.log("Dm.execution rejected", err);
          });
      })
      .catch((err) => {
        console.log("Nlu.computation rejected", err);
      });
  }
}

module.exports = Bot;
