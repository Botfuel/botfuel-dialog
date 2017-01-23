'use strict';

class SyncStep {
    run(entities, responses) {
        this.syncRun(entities, responses);
        return Promise.resolve();
    }
}

module.exports = SyncStep;
