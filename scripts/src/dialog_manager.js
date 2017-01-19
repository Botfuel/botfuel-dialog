'use strict';

/**
 * Manages the dialog stack.
 */
class DialogManager {
    constructor() {
        this.stack = [];
    }

    /**
     * Updates the stack with the intents.
     */
    update(intents) {
        this.stack
            .push(intents[0][0]); // updating stack with intents
    }

    execute(res, intents) {
        console.log("DialogManager.execute");
        this.update(intents);
        if (this.stack.length > 0) {
            let dialog = this.stack[0];
            let steps = require(`./dialogs/${dialog}`);
            steps[0].run(res); // TODO: execute all the steps and when completed pop
        }
    }
}

module.exports = DialogManager
