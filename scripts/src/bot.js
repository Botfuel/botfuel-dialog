'use strict';

var Message = require('@botfuel/bot-common').Message
var DialogManager = require('./dialog_manager');
var Classifier = require('./classifier');
var { locale } = require('./config');

/**
  * Bot main class.
  * This class only is aware of Hubot.
  */
class Bot {
    /**
     * @param {Object} an hubot robot
     */
    constructor(hubot) {
        this.hubot = hubot;
        this.brain = hubot.brain;
        this.classifier = new Classifier(locale);
        this.dm = new DialogManager();
    }

    /**
     * Responds.
     * @param {Response} Hubot's response object
     */
    respond(res) {
        console.log("Bot.respond");
        let sentence = Message.getSentence(res);
        this.classifier
            .classify(sentence)
            .then(({entities, intents}) => {
                console.log(`classification resolved ${entities} ${intents}`);
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

module.exports = Bot
