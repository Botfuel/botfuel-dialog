'use strict';

const Steps = require('../steps');

module.exports = [
    Steps.say('hello'),
    Steps.wait(),
    Steps.say('thanks')
];
