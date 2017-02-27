'use strict';

const AsyncStep = require('./async_step');

/**
 * A step that waits for a user input.
 */
class WaitStep extends AsyncStep {
    /**
     * Asynchronous run method.
     * @param {Object[]} entities the transient entities
     * @param {responses[]} responses the responses
     */
    run(entities, responses) {
        return Promise.resolve(false);
    }
}

module.exports = WaitStep;
