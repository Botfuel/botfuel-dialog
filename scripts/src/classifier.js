'use strict';

var Nlu = require('./nlu');

/**
 * A classifier (could be replaced by an external one).
 */
class Classifier {
    /**
     * Constructor.
     * @param {string} locale the locale
     */
    constructor(locale) {
        this.nlu = new Nlu(locale);
        // TODO: load model from file
    }

    classifyFromFeatures(features) {
        return [
            { intent: 'greetings', confidence: 1.0} // TODO: fix this
        ];
    }

    /**
     * Classifies a sentence.
     * @param {string} sentence the sentence
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
                    intents: this.classifyFromFeatures(features)
                });
            })
            .catch((err) => {
                console.log("nlu rejected", err);
            });
    }
}

module.exports = Classifier;
