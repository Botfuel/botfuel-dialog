class Bot {
    constructor(robot) {
        this.robot = robot;
    }

    respond(res) {
        let response = "OK";
        return res.send(response);
    }
}

module.exports = Bot
