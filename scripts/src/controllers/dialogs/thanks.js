'use strict';

const Dialog = require('./dialog');

class Thanks extends Dialog {
  execute(dm, id) {
    console.log("Thanks.execute", '<dm>', id);
    dm.say(id, 'thanks');
    return Promise.resolve(true);
  }
}

module.exports = Thanks;
