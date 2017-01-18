Message = require('@botfuel/bot-common').Message
Nlu = require('./nlu')

class Bot {
    constructor(robot) {
        this.robot = robot;
    }

    respond(res) {
        Nlu.analyze(Message.getSentence(res)).then((val) => {
            let response = "OK";
            res.send(response);
        });
    }
}

module.exports = Bot
