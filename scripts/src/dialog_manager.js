'use strict';

/**
 * Manages the dialog/step stack.
 */
class DialogManager {
    constructor() {
        this.stack = [];
    }

    /**
     * Updates the stack with the steps.
     * @param {Object[]} an array of intent-probability pairs
     */
    updateStack(intents) {
        console.log("DialogManager.updateStack");
        intents.forEach(([intent, probability]) => {
            let dialog = intent;
            let steps = require(`./dialogs/${dialog}`)
                .reverse();
            this.stack
                .push(...steps);
        });
    }

    executeIntents(entities, intents) {
        console.log("DialogManager.executeIntents");
        this.updateStack(intents);
        return this.executeStack(entities, []);
    }

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

module.exports = DialogManager
