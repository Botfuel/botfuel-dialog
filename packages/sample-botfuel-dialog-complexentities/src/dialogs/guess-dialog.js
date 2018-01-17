'use strict';

const { PromptDialog } = require('botfuel-dialog');

class GuessDialog extends PromptDialog {}

GuessDialog.params = {
  namespace: 'guess',
  entities: {
    favoriteColor: {
      dim: 'color',
      isFulfilled: colorEntity => colorEntity && colorEntity.values[0].name === 'red',
    },
  },
};

module.exports = GuessDialog;
