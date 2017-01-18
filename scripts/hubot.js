'use strict';

var Bot = require('./src/bot');

module.exports = (robot) => {
    let bot = new Bot(robot);
    robot.hear(/.*/, res => {
        return bot.respond(res);
    });
};
