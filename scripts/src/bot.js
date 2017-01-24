'use strict';

const Message = require('@botfuel/bot-common').Message;
const DialogManager = require('./dialog_manager');
const Nlp = require('./nlp');
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
        this.hubot = hubot;
        this.brain = hubot.brain;
        this.nlp = new Nlp(locale);
        this.dm = new DialogManager();
    }

    /**
     * Responds.
     * @param {Response} res Hubot's response object
     */
    respond(res) {
        console.log("Bot.respond");
        let sentence = Message.getSentence(res);
        this.nlp
            .classify(sentence)
            .then(({entities, intents}) => {
                console.log("classification resolved", entities, intents);
                this.dm
                    .executeIntents(entities, intents)
                    .then((responses) => {
                        console.log("intents execution resolved");
                        responses.forEach((response) => {
                            res.send(response);
                        }); // TODO: do we need to wait here?
                    })
                    .catch((err) => {
                        console.log("intents execution rejected", err);
                    });
            })
            .catch((err) => {
                console.log("classification rejected", err);
            });
    }
}

module.exports = Bot;
