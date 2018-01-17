'use strict';

const { PromptDialog } = require('botfuel-dialog');

class WeightDialog extends PromptDialog {}

WeightDialog.params = {
  namespace: 'weight',
  entities: {
    fatherWeight: {
      dim: 'weight',
      priority: 2,
    },
    myWeight: {
      dim: 'weight',
      priority: 3,
    },
    motherWeight: {
      dim: 'weight',
      priority: 1,
    },
  },
};

module.exports = WeightDialog;
