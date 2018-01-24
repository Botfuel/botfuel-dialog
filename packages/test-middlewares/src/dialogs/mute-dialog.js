const { TextDialog } = require('botfuel-dialog');

class Mute extends TextDialog {
  dialogWillComplete(userMessage) {
    this.brain.userSet(userMessage.user, '_isMuted', true);
  }
}

module.exports = Mute;
