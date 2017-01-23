'use strict';

class SayStep {
    constructor(sentence) {
        this.sentence = sentence
    }

    run(entities, responses) {
        responses.push(this.sentence);
        return Promise.resolve();
    }
}

module.exports = SayStep
