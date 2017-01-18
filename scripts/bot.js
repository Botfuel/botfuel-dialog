module.exports = robot => {
    return robot.hear(/.*/, res => {
        let response = "OK";
        return res.send(response);
    });
};
