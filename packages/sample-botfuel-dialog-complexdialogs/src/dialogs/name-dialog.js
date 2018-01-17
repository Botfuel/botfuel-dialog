'use strict';

const { PromptDialog } = require('botfuel-dialog');

class NameDialog extends PromptDialog {}

NameDialog.params = {
  namespace: 'name',
  entities: {
    name: {
      dim: 'forename',
    },
  },
};

module.exports = NameDialog;
