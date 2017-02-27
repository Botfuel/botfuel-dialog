'use strict';

const SayStep = require('./say_step');
const WaitStep = require('./wait_step');

/**
 * Creates steps.
 */
class Steps {
    static say(template) {
        return new SayStep(template);
    }

    static wait() {
        return new WaitStep();
    }

}

module.exports = Steps;
