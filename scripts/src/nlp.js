'use strict';

const Nlu = require('./nlu');
const Natural = require('natural');
const { modelName } = require('./config');

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

    initClassifierIfNecessary() {
        console.log("Nlp.initClassifierIfNecessary");
        if (this.classifier) {
            console.log("Nlp.initClassifierIfNecessary: already initialized");
            return Promise.resolve();
        } else {
            let model = `${ __dirname }/../../models/${ modelName }`;
            console.log("Nlp.initClassifierIfNecessary: initializing", model);
            return new Promise((resolve,reject) => {
                Natural.LogisticRegressionClassifier.load(model, null, (err, classifier) => {
                    if (err !== null) {
                        return reject(err);
                    } else {
                        this.classifier = classifier;
                        return resolve();
                    }
                });
            });
        }
    }

    /**
     * Classifies a sentence.
     * @param {string} sentence the sentence
     * @return {Promise} a promise with entities and intents
     */
    classify(sentence) {
        console.log("Nlp.classify");
        return this
            .initClassifierIfNecessary()
            .then(() => {
                console.log("classifier initialisation resolved", this.classifier);
                return this
                    .nlu
                    .analyze(sentence)
                    .then(({entities, features}) => {
                        console.log("nlu resolved", entities, features);
                        let intents = this.classifier.getClassifications(features);
                        console.log("Nlp.classify: intents", intents);
                        return Promise.resolve({
                            entities: entities,
                            intents: intents
                        });
                    })
                    .catch((err) => {
                        console.log("nlu rejected", err);
                    });
            })
            .catch((err) => {
                console.log("classifier initialisation rejected", err);
            });
    }
}

module.exports = Nlp;
