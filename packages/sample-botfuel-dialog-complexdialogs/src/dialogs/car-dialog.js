'use strict';

const { PromptDialog } = require('botfuel-dialog');

class CarDialog extends PromptDialog {
  async dialogWillComplete() {
    return this.triggerNext('thanks');
  }
}

CarDialog.params = {
  namespace: 'car',
  entities: {
    color: {
      dim: 'color',
    },
    transmission: {
      dim: 'transmission',
    },
  },
};

module.exports = CarDialog;
