'use strict';

const Dialog = require('./dialog');

class Greetings extends Dialog {
  execute(dm) {
    dm.respond("Hello!"); // use template instead
    dm.call('thanks');
    return Promise.resolve(false);
  }
}

module.exports = Greetings;
