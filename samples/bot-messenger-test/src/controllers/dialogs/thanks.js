'use strict';

const sdk2 = require('@botfuel/bot-sdk2');

class Thanks extends sdk2.Dialog {
  constructor(config, brain) {
    super(config, brain, 'thanks');
  }
}

module.exports = Thanks;
