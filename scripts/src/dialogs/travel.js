'use strict';

const Dialog = require('./dialog');

class Travel extends Dialog {
  execute(dm) {
    dm.respond("Vas-y!"); // use template instead
    return Promise.resolve(true);
  }
}

module.exports = Travel;
