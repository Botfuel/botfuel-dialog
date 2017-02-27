'use strict';

/**
 * Asynchronous step.
 */
class AsyncStep {
    /**
     * Asynchronous run method.
     * @param {Object[]} entities the transient entities
     * @param {responses[]} responses the responses
     * @return {Promise} a promise
     */
    run(entities, responses) {
        return Promise.resolve(true);
    }
}

module.exports = AsyncStep;
