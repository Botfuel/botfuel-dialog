'use strict';

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
            features: [
                "feature1", "feature2"
            ]
        });
    }
}

module.exports = Nlu;
