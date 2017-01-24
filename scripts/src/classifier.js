'use strict';

const Nlu = require('./nlu');
const Natural = require('natural');

/**
 * A nlp module (could be replaced by an external one).
 */
class Nlp {
    /**
     * Constructor.
     * @param {string} locale the locale
     */
    constructor(locale) {
        this.nlu = new Nlu(locale);
    }

    classifyFromFeatures(features) {
        return [ // TODO: fix this
            { label: 'greetings', value: 1.0},
            { label: 'thanks', value: 1.0}
        ];
    }

    /**
     * Classifies a sentence.
     * @param {string} sentence the sentence
     * @return {Promise} a promise with entities and intents
     */
    classify(sentence) {
        console.log("Nlp.classify");
        return this
            .nlu
            .analyze(sentence)
            .then(({entities, features}) => {
                console.log("nlu resolved", entities, features);
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

module.exports = Nlp;
