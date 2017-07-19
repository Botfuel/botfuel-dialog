'use strict';

const Dialog = require('./dialog');

class Greetings extends Dialog {
  execute(id, responses) {
    responses.push("Hello!"); // use template instead
    this.dm.next(id, 'thanks');
    return Promise.resolve(false);
  }
}

module.exports = Greetings;
