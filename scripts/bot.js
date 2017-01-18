module.exports = function(robot) {
    return robot.hear(/.*/, function(res) {
        return res.send("OK");
    });
};
