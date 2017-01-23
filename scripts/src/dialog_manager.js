'use strict';

/**
 * Manages the dialog/step stack.
 */
class DialogManager {
    /**
     * Constructor.
     */
    constructor() {
        this.stack = [];
    }

    /**
     * Updates the stack with the steps.
     * @param {Object[]} intents an array of intents with their probabilities
     */
    updateStack(intents) {
        console.log("DialogManager.updateStack");
        intents.forEach(({intent, probability}) => {
            let dialog = intent;
            let steps = require(`./dialogs/${dialog}`)
                .reverse();
            this.stack
                .push(...steps);
        });
    }

    /**
     * Populates and executes the stack.
     * @param {Object[]} entities the transient entities
     * @param {string[]} intents the intents
     */
    executeIntents(entities, intents) {
        console.log("DialogManager.executeIntents");
        this.updateStack(intents);
        return this.executeStack(entities, []);
    }

    /**
     * Executes the stack.
     * @param {Object[]} entities the transient entities
     * @param {responses[]} responses the responses
     */
    executeStack(entities, responses) {
        console.log(`DialogManager.executeStack ${ this.stack }`);
        if (this.stack.length > 0) {
            let step = this.stack.pop();
            return step
                .run(entities, responses)
                .then(() => {
                    return this.executeStack(entities, responses);
                });
        } else {
            return Promise.resolve(responses);
        }
    }
}

module.exports = DialogManager;
