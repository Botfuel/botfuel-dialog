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
        // TODO: fix this
        Natural
            .PorterStemmerFr
            .attach();
    }

    computeFeatures(sentence) {
        return sentence.tokenizeAndStem();
    }

    /**
     * Analyzes a sentence.
     * @param {string} sentence the sentence
     * @return {Promise} a promise with entities and features
     */
    analyze(sentence) {
        console.log("analyze");
        // TODO: fix this
        return Promise.resolve({
            entities: [
                "entity1", "entity2"
            ],
            features: this.computeFeatures(sentence)
        });
    }
}

module.exports = Nlu;
