const { TextDialog } = require('botfuel-dialog');

class Mute extends TextDialog {
  dialogWillComplete(userId) {
    this.brain.userSet(userId, '_isMuted', true);
  }
}

module.exports = Mute;
