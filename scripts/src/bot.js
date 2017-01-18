'use strict';

var Message = require('@botfuel/bot-common').Message
var Nlu = require('./nlu')
var DialogManager = require('./dialog_manager');
var Classifier = require('./classifier');
var { locale } = require('./config');

class Bot {
    constructor(robot) {
        this.robot = robot;
        this.nlu = new Nlu(locale);
        this.dm = new DialogManager();
        this.classifier = new Classifier();
    }

    respond(res) {
        let sentence = Message.getSentence(res);
        this.nlu
            .analyze(sentence)
            .then(({entities, features}) => {
                // update brain with entities
                this.classifier
                    .classify(features)
                    .then((intents) => {
                        this.dm.execute(res, intents);
                    })
                    .catch((err) => {
                        console.log("classification rejected", err);
                    });
            })
            .catch((err) => {
                console.log("nlu rejected", err);
            });
    }
}

module.exports = Bot
