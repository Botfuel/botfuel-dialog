'use strict';

const Dialog = require('./dialog');

class Thanks extends Dialog {
  execute(id, responses) {
    responses.push("Thanks!");
    return Promise.resolve(true);
  }
}

module.exports = Thanks;
