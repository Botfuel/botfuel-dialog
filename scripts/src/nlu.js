'use strict';

const Natural = require('natural');

/**
 * NLU wrapper.
 */
class Nlu {
    /**
     * Constructor.
     * @param {string} locale the locale
     */
    constructor(locale) {
        this.locale = locale;
    }

    static computeFeatures(sentence) {
        Natural
            .PorterStemmerFr
            .attach();
        return sentence.tokenizeAndStem();
    }

    /**
     * Analyzes a sentence.
     * @param {string} sentence the sentence
     * @return {Promise} a promise with entities and features
     */
    analyze(sentence) {
        console.log("Nlu.analyze");
        // TODO: fix this
        return Promise.resolve({
            entities: [
                "entity1", "entity2"
            ],
            features: Nlu.computeFeatures(sentence)
        });
    }
}

module.exports = Nlu;
