Message = require('@botfuel/bot-common').Message
Nlu = require('./nlu')

class Bot {
    constructor(robot) {
        this.robot = robot;
    }

    respond(res) {
        let sentence = Message.getSentence(res);
        Nlu
            .analyze(sentence)
            .then(({entities, features}) => {
                res.send(`${ entities } ${ features }`);
            })
            .catch((err) => {
                console.log("rejected", err);
            });
    }
}

module.exports = Bot
