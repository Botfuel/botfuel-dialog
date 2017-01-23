'use strict';

var SyncStep = require('./sync_step');

class SayStep extends SyncStep {
    constructor(sentence) {
        super();
        this.sentence = sentence
    }

    syncRun(entities, responses) {
        responses.push(this.sentence);
    }
}

module.exports = SayStep;
