const Dialog = require('./dialog');

class Confirm extends Dialog {
  execute(dm, id) {
    console.log(this.parameters);
    dm.say(id, 'entity extracted', { entity: this.parameters.extractedEntity });
    return Promise.resolve(true);
  }
}

module.exports = Confirm;
