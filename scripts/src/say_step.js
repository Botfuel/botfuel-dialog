'use strict';

const SyncStep = require('./sync_step');

/**
 * A step that says something.
 */
class SayStep extends SyncStep {
    /**
     * Constructor.
     * @param {string} sentence a sentence
     */
    constructor(sentence) {
        super();
        this.sentence = sentence;
    }

    /**
     * Synchronous run method.
     * @param {Object[]} entities the transient entities
     * @param {responses[]} responses the responses
     */
    syncRun(entities, responses) {
        responses.push(this.sentence);
    }
}

module.exports = SayStep;
