'use strict';

class Classifier {
    classify(features) {
        return new Promise((resolve, reject) => {
            resolve([
                ['greetings', 1.0]
            ]);
        });
    }
}

module.exports = Classifier
