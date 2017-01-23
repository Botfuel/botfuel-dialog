'use strict';

/**
 * NLU wrapper.
 */
class Nlu {
    constructor(locale) {
        this.locale = locale;
    }

    /**
     * Analyzes a sentence.
     * @param {string} the sentence
     * @return {Promise} a promise with entities and features
     */
    analyze(sentence) {
        console.log("Nlu.analyze");
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
