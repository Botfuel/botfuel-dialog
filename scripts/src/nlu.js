'use strict';

class Nlu {
    constructor(locale) {
        this.locale = locale;
    }

    analyze(sentence) {
        return new Promise((resolve, reject) => {
            resolve({
                entities: [
                    "entity"
                ],
                features: [
                    "feature"
                ]
            });
        });
    }
}

module.exports = Nlu
