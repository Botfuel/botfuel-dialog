'use strict';

class SayStep {
    constructor(sentence) {
        this.sentence = sentence
    }

    run(res) {
        res.send(this.sentence);
    }
}

module.exports = SayStep
