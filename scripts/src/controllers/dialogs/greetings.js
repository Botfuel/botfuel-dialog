'use strict';

const Dialog = require('./dialog');

class Greetings extends Dialog {
  execute(dm, id) {
    console.log("Greetings.execute", '<dm>', id);
    dm.say(id, 'hello');
    dm.next(id, 'thanks');
    return Promise.resolve(false);
  }
}

module.exports = Greetings;
