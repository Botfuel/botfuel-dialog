'use strict';

const { PromptDialog } = require('botfuel-dialog');

class TravelDialog extends PromptDialog {}

TravelDialog.params = {
  namespace: 'travel',
  entities: {
    time: {
      dim: 'time',
    },
    city: {
      dim: 'city',
    },
  },
};

module.exports = TravelDialog;
