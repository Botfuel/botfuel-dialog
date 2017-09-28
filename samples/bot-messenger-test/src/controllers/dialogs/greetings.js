'use strict';

const sdk2 = require('@botfuel/bot-sdk2');

class Greetings extends sdk2.TextDialog {
  constructor(config, brain) {
    super(config, brain, 'hello');
  }
}

module.exports = Greetings;
