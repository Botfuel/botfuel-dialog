'use strict';

const Message = require('@botfuel/bot-common').Message;
const DialogManager = require('./dialog_manager');
const Nlu = require('./nlu');
const { locale } = require('./config');

/**
  * Bot main class.
  * Only this class knows about Hubot.
  */
class Bot {
  /**
   * @param {Object} hubot an hubot robot
   */
  constructor(hubot) {
    this.nlu = new Nlu(hubot.brain, locale);
    this.dm = new DialogManager(hubot.brain);
  }

  /**
   * Responds.
   * @param {Response} res Hubot's response object
   */
  respond(res) {
    console.log("Bot.respond");
    let sentence = Message.getSentence(res);
    this
      .nlu
      .classify(sentence)
      .then(({entities: entities, intents: intents}) => {
        console.log("Bot.classification resolved", entities, intents);
        this
          .dm
          .executeIntents(intents, entities)
          .then((responses) => {
            console.log("Bot.intents execution resolved");
            responses.forEach((response) => {
              res.send(response);
            }); // TODO: do we need to wait here?
          })
          .catch((err) => {
            console.log("Bot.intents execution rejected", err);
          });
      })
      .catch((err) => {
        console.log("Bot.classification rejected", err);
      });
  }
}

module.exports = Bot;
