'use strict';

const fs = require('fs-promise');
const AsyncStep = require('./async_step');

/**
 * A step that says something.
 */
class SayStep extends AsyncStep {
    /**
     * Constructor.
     * @param {string} template a template
     */
    constructor(templateKey) {
        super();
        this.templateKey = templateKey;
    }

    // TODO: how do we pass the locale?
    initTemplateIfNecessary() {
        console.log("SayStep.initTemplateIfNecessary");
        if (this.lines) {
            console.log("SayStep.initTemplateIfNecessary: already initialized");
            return Promise.resolve();
        } else {
            console.log("SayStep.initTemplateIfNecessary: initializing");
            let template = `${ __dirname }/templates/${ this.templateKey }.fr.txt`;
            return fs
                .readFile(template)
                .then((data) => {
                    // console.log("SayStep.initTemplateIfNecessary", data.toString());
                    this.lines = data
                        .toString()
                        .split("\n")
                        .filter((line) => line != '');
                    return Promise.resolve();
                });
        }
    }

    /**
     * Asynchronous run method.
     * @param {Object[]} entities the transient entities
     * @param {responses[]} responses the responses
     */
    run(entities, responses) {
        return this
            .initTemplateIfNecessary()
            .then(() => {
                console.log("template initialisation resolved", this.lines);
                // TODO: resolve each line by replacing variables by values
                responses.push(...this.lines);
                return Promise.resolve(true);
            })
            .catch((err) => {
                console.log("template initialisation rejected", err);
            });
    }
}

module.exports = SayStep;
