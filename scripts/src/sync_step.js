'use strict';

/**
 * Synchronous step.
 */
class SyncStep {
    /**
     * Asynchronous run method.
     * @param {Object[]} entities the transient entities
     * @param {responses[]} responses the responses
     * @return {Promise} a promise
     */
    run(entities, responses) {
        this.syncRun(entities, responses);
        return Promise.resolve();
    }
}

module.exports = SyncStep;
