'use strict';

/**
 * Manages the dialog stack.
 */
class DialogManager {
    constructor() {
        this.stack = [];
    }

    execute(res, intents) {
        this.stack
            .push(intents[0][0]); // updating stack with intents
        // execute stack (should return a promise)
        res.send(`OK ${this.stack[0]}`);
    }
}

module.exports = DialogManager
