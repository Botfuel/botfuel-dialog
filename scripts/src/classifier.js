'use strict';

var Nlu = require('./nlu')

/**
 * A classifier (could be replaced by an external one).
 */
class Classifier {
    constructor(locale) {
        this.nlu = new Nlu(locale);
    }

    /**
     * Classifies a sentence.
     * @param {string} the sentence
     * @return {Promise} a promise with entities and intents
     */
    classify(sentence) {
        console.log("Classifier.classify");
        return this
            .nlu
            .analyze(sentence)
            .then(({entities, features}) => {
                console.log(`nlu resolved ${entities} ${features}`);
                return Promise.resolve({
                    entities: entities,
                    intents: [
                        ['greetings', 1.0] // TODO: fix this
                    ]
                });
            })
            .catch((err) => {
                console.log("nlu rejected", err);
            });
    }
}

module.exports = Classifier
