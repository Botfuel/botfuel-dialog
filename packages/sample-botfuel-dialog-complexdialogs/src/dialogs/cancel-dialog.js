'use strict';

const { ConfirmationDialog } = require('botfuel-dialog');

class Cancel extends ConfirmationDialog {
  async dialogWillComplete(userId, { matchedEntities }) {
    const answer = matchedEntities.boolean.values[0].value;

    // Clean entities for this dialog so it can be reused later
    await this.brain.conversationSet(userId, this.parameters.namespace, {});

    if (answer) {
      return this.cancelPrevious('greetings');
    }

    return this.complete();
  }
}

Cancel.params = {
  namespace: 'cancel',
  entities: {
    boolean: {
      dim: 'system:boolean',
    },
  },
};

module.exports = Cancel;
