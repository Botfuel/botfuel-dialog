'use strict';

var Message = require('@botfuel/bot-common').Message
var DialogManager = require('./dialog_manager');
var Classifier = require('./classifier');
var { locale } = require('./config');

/**
  * Bot main class.
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
                // TODO: update brain with entities
                this.dm
                    .execute(res, intents);
            })
            .catch((err) => {
                console.log("classification rejected", err);
            });
    }
}

module.exports = Bot
