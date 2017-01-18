Bot = require('./src/bot')

module.exports = (robot) => {
    bot = new Bot(robot);
    robot.hear(/.*/, res => {
        return bot.respond(res);
    });
};
